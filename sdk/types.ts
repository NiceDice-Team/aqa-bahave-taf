export enum AdapterType {
  WEB = 'web',
  API = 'api'
}

export interface SDKOptions {
  adapterType: AdapterType;
}