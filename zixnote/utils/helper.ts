export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
export type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;
export const isDevEnvironment =
  process && process.env.NODE_ENV === "development";
export const BASE_URL = isDevEnvironment
  ? "http://localhost:3000"
  : "https://zixnote.vercel.app";
