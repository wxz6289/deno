declare module '@std/fs' {
  export function copy(
    from: string,
    to: string,
    options?: { overwrite?: boolean },
  ): Promise<void>;
  export function ensureFile(path: string): Promise<void>;
}

declare module '@std/path' {
  export function join(...paths: string[]): string;
}