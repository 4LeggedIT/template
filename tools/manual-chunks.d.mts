export declare function manualChunks(
  id: string,
  meta?: { getModuleInfo?: (id: string) => { importedIds: readonly string[] } | null },
): string | undefined;
