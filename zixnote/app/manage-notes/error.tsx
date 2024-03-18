"use client"; // Error components must be Client Components


import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }
  return (
    <div>
      <h2>Something went wrong! {error.message.toString()}</h2>
      <button  onClick={reload}>Reload</button>
    </div>
  );
}
