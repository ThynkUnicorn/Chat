import { useEffect, useRef } from "react";

/**
 * Keeps a chat list scrolled to the bottom whenever `deps` change.
 * Returns a ref that you should place **after** the last message.
 */
export default function useAutoScroll(deps = []) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, deps);            // eslint-disable-line react-hooks/exhaustive-deps

  return endRef;
}
