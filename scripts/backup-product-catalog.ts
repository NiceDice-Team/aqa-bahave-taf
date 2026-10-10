import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_API_BASE_URL = 'https://bgshop.work.gd/api';
const DEFAULT_CONCURRENCY = 12;
const IMAGE_VARIANTS = ['original', 'lg', 'md', 'sm'] as const;

type ImageVariant = (typeof IMAGE_VARIANTS)[number];

interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  results: T[];
}

interface ProductImage {
  id: number;
  product_id: number;
  url_original: string;
  url_lg: string;
  url_md: string;
  url_sm: string;
  alt: string;
  sort: number;
}

interface Product {
  id: number;
  name: string;
  images: ProductImage[];
  [key: string]: unknown;
}

interface DownloadTask {
  productId: number;
  productName: string;
  imageId: number;
  sort: number;
  variant: ImageVariant;
  sourceUrl: string;
  relativePath: string;
}

interface DownloadResult extends DownloadTask {
  status: 'downloaded' | 'reused' | 'failed';
  bytes?: number;
  contentType?: string;
  sha256?: string;
  error?: string;
}

interface CliOptions {
  apiBaseUrl: string;
  outputDirectory: string;
  concurrency: number;
}

function parseArguments(): CliOptions {
  const args = process.argv.slice(2);
  const valueFor = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const date = new Date().toISOString().slice(0, 10);
  const apiBaseUrl = (valueFor('--api-base-url') ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
  const outputDirectory = path.resolve(valueFor('--output') ?? path.join('backups', 'product-catalog', date));
  const concurrency = Number.parseInt(valueFor('--concurrency') ?? `${DEFAULT_CONCURRENCY}`, 10);

  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 50) {
    throw new Error('--concurrency must be an integer between 1 and 50');
  }

  return { apiBaseUrl, outputDirectory, concurrency };
}

async function fetchWithRetries(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function fetchCollection<T>(apiBaseUrl: string, endpoint: string): Promise<T[]> {
  let url: string | null = `${apiBaseUrl}/${endpoint.replace(/^\//, '')}`;
  const records: T[] = [];

  while (url) {
    const response = await fetchWithRetries(url);
    const payload = (await response.json()) as PaginatedResponse<T> | T[];

    if (Array.isArray(payload)) {
      records.push(...payload);
      break;
    }

    records.push(...payload.results);
    url = payload.next ?? null;
  }

  return records;
}

async function fetchReferencedLookups(apiBaseUrl: string, endpoint: string, ids: number[]): Promise<unknown[]> {
  return Promise.all(
    ids.map(async (id) => {
      const response = await fetchWithRetries(`${apiBaseUrl}/${endpoint}/${id}/`);
      return { id, ...((await response.json()) as Record<string, unknown>) };
    })
  );
}

function extensionFor(sourceUrl: string): string {
  const extension = path.extname(new URL(sourceUrl).pathname).toLowerCase();
  return /^\.[a-z0-9]{2,5}$/.test(extension) ? extension : '.bin';
}

function buildDownloadTasks(products: Product[]): DownloadTask[] {
  return products.flatMap((product) =>
    product.images.flatMap((image) =>
      IMAGE_VARIANTS.flatMap((variant) => {
        const sourceUrl = image[`url_${variant}`];
        if (!sourceUrl) return [];

        return [
          {
            productId: product.id,
            productName: product.name,
            imageId: image.id,
            sort: image.sort,
            variant,
            sourceUrl,
            relativePath: path.posix.join(
              'images',
              `product-${product.id}`,
              `image-${image.id}-sort-${image.sort}`,
              `${variant}${extensionFor(sourceUrl)}`
            ),
          },
        ];
      })
    )
  );
}

function sha256(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

async function downloadImage(outputDirectory: string, task: DownloadTask): Promise<DownloadResult> {
  const destination = path.join(outputDirectory, task.relativePath);

  try {
    const existing = await readFile(destination);
    return {
      ...task,
      status: 'reused',
      bytes: existing.byteLength,
      sha256: sha256(existing),
    };
  } catch {
    // The snapshot is resumable: only missing files are requested again.
  }

  try {
    const response = await fetchWithRetries(task.sourceUrl);
    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
      throw new Error(`Expected image response, received ${contentType}`);
    }

    const content = Buffer.from(await response.arrayBuffer());
    if (content.byteLength === 0) throw new Error('Downloaded file is empty');

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content);

    return {
      ...task,
      status: 'downloaded',
      bytes: content.byteLength,
      contentType,
      sha256: sha256(content),
    };
  } catch (error) {
    return {
      ...task,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runPool<T, R>(values: T[], concurrency: number, operation: (value: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;

  const worker = async (): Promise<void> => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await operation(values[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return results;
}

async function writeJson(destination: string, value: unknown): Promise<void> {
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function main(): Promise<void> {
  const options = parseArguments();
  await mkdir(options.outputDirectory, { recursive: true });

  const [products, categories] = await Promise.all([
    fetchCollection<Product>(options.apiBaseUrl, 'products/?limit=100'),
    fetchCollection<unknown>(options.apiBaseUrl, 'categories/?limit=100'),
  ]);
  const referencedIds = (field: 'brand' | 'types' | 'audiences'): number[] =>
    [
      ...new Set(
        products.flatMap((product) => {
          const value = product[field];
          return Array.isArray(value) ? (value as number[]) : [value as number];
        })
      ),
    ].sort((left, right) => left - right);
  const [brands, gameTypes, audiences] = await Promise.all([
    fetchReferencedLookups(options.apiBaseUrl, 'brands', referencedIds('brand')),
    fetchReferencedLookups(options.apiBaseUrl, 'game-types', referencedIds('types')),
    fetchReferencedLookups(options.apiBaseUrl, 'audiences', referencedIds('audiences')),
  ]);

  await writeJson(path.join(options.outputDirectory, 'products.json'), products);
  await writeJson(path.join(options.outputDirectory, 'lookups.json'), {
    categories,
    brands,
    gameTypes,
    audiences,
  });

  const tasks = buildDownloadTasks(products);
  process.stdout.write(`Downloading ${tasks.length} product image files...\n`);
  const images = await runPool(tasks, options.concurrency, (task) => downloadImage(options.outputDirectory, task));
  await writeJson(path.join(options.outputDirectory, 'images-manifest.json'), images);

  const failed = images.filter((image) => image.status === 'failed');
  const totalBytes = images.reduce((sum, image) => sum + (image.bytes ?? 0), 0);
  const metadata = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    source: {
      catalogUrl: 'https://team-challange-front-yx5j.vercel.app/catalog',
      apiBaseUrl: options.apiBaseUrl,
    },
    counts: {
      products: products.length,
      productImageRecords: products.reduce((sum, product) => sum + product.images.length, 0),
      imageFiles: images.length,
      downloadedOrReusedImageFiles: images.length - failed.length,
      failedImageFiles: failed.length,
      totalImageBytes: totalBytes,
      categories: categories.length,
      brands: brands.length,
      gameTypes: gameTypes.length,
      audiences: audiences.length,
    },
  };
  await writeJson(path.join(options.outputDirectory, 'metadata.json'), metadata);

  process.stdout.write(`${JSON.stringify(metadata, null, 2)}\n`);
  if (failed.length > 0) {
    throw new Error(`${failed.length} image downloads failed; rerun the command to retry them`);
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
