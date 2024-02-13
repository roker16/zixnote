export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
export type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;
