declare const __ENV: Record<string, string | undefined>;

declare module 'k6' {
  export function check<T>(value: T, checks: Record<string, (value: T) => boolean>): boolean;
  export function group<T>(name: string, callback: () => T): T;
  export function sleep(seconds: number): void;
}

declare module 'k6/http' {
  export interface Response {
    status: number;
    body: string | null;
    timings: {
      duration: number;
    };
    json(): unknown;
  }

  interface RequestOptions {
    headers?: Record<string, string>;
  }

  interface HttpClient {
    get(url: string, options?: RequestOptions): Response;
    post(url: string, body?: string | null, options?: RequestOptions): Response;
  }

  const http: HttpClient;
  export default http;
}

declare module 'k6/metrics' {
  export class Trend {
    constructor(name: string, isTime?: boolean);
    add(value: number): void;
  }

  export class Rate {
    constructor(name: string);
    add(value: boolean | number): void;
  }
}

declare module 'k6/data' {
  export class SharedArray<T> {
    constructor(name: string, factory: () => T[]);
    readonly [index: number]: T;
  }
}
