import { useCallback, useEffect, useRef, useState } from "react";

export interface FilePreview {
  file: File;
  url: string;
}

/**
 * Pré-visualização LOCAL de um ficheiro escolhido (object URL).
 * Não envia nada para nenhum servidor; liberta a memória ao trocar/desmontar.
 */
export function useFilePreview() {
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const currentUrl = useRef<string | null>(null);

  const setFile = useCallback((file: File | null) => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    const next = file ? { file, url: URL.createObjectURL(file) } : null;
    currentUrl.current = next?.url ?? null;
    setPreview(next);
  }, []);

  useEffect(
    () => () => {
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    },
    []
  );

  return { preview, setFile };
}

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

/** Valida um ficheiro de imagem; devolve mensagem de erro ou null. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Formato não suportado (use JPG, PNG, WebP ou HEIC).";
  if (file.size > MAX_IMAGE_BYTES) return "Ficheiro demasiado grande (máximo 25 MB).";
  return null;
}
