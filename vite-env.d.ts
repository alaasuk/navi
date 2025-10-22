
// Fix: Removed the triple-slash directive which was causing a "Cannot find type definition file" error.
// The interfaces below provide the necessary types for `import.meta.env`.
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
