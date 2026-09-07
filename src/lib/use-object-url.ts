import { useEffect, useMemo } from "react";

/**
 * Creates an object URL for `file` (e.g. for an image preview) and revokes
 * it whenever `file` changes or the component unmounts.
 */
export function useObjectUrl(file: File | null): string | null {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
}
