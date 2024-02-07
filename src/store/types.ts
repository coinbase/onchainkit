export type StorageValue = string | null | undefined;

export type StorageInterface = {
  getData: (key: string) => Promise<StorageValue>;
  setData: (key: string, value: StorageValue) => Promise<void>;
};
