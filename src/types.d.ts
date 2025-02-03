declare namespace NodeJS {
  export interface ProcessEnv {
    DB_NAME: string;
    APP_PORT: string;
    NODE_ENV: string;
  }
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
