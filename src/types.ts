export type StorageValue = string | null | undefined;

export type StorageInterface = {
  getData: (key: string) => Promise<StorageValue>;
  setData: (key: string, value: StorageValue) => Promise<void>;
};

export type ActionFunction<T> = () => Promise<T>;

export type ActionKey = string;
