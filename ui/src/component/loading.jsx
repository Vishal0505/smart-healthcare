import { Spinner } from "@radix-ui/themes";

export function Loading({ condition, children }) {
  return <>{condition ? <Spinner loading={condition} /> : children}</>;
}
