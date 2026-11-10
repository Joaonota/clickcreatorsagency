import { useCallback, useEffect, useState } from "react";

export type ResourceState<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: unknown };

/**
 * Carrega um recurso assíncrono do repositório com estados explícitos
 * (loading / success / error) e permite recarregar.
 * `key` identifica o pedido: quando muda, o recurso é recarregado.
 */
export function useAsyncResource<T>(loader: () => Promise<T>, key: string) {
  const [state, setState] = useState<ResourceState<T>>({ status: "loading", data: null, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    loader()
      .then((data) => {
        if (active) setState({ status: "success", data, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ status: "error", data: null, error });
      });
    return () => {
      active = false;
    };
    // `loader` é recriado a cada render; `key` + `version` controlam o pedido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  const reload = useCallback(() => {
    setState({ status: "loading", data: null, error: null });
    setVersion((value) => value + 1);
  }, []);

  return { ...state, reload };
}
