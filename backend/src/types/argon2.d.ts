declare module 'argon2' {
  interface Options {
    type?: 0 | 1 | 2;
    memoryCost?: number;
    timeCost?: number;
    parallelism?: number;
    saltLength?: number;
    hashLength?: number;
    raw?: boolean;
    secret?: Buffer;
    associatedData?: Buffer;
  }

  function hash(plain: string | Buffer, options?: Options): Promise<string>;
  function verify(hash: string, plain: string | Buffer): Promise<boolean>;

  const defaults: Options;
  
  export { hash, verify, defaults };
  export default { hash, verify, defaults };
} 