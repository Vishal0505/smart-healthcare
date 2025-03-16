/**
 * @param {object} Props
 * @param {boolean} Props.when
 * @param {React.ReactNode} [Props.fallback]
 * @param {React.ReactNode} Props.children
 * @returns
 */
export function Show({ when, fallback: Fallback, children }) {
  return <>{when ? children : Fallback ?? null}</>;
}
