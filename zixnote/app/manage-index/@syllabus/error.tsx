"use client"; // Error components must be Client Components

import { ErrorBoundaryComponent } from "../../../components/ErrorBoundaryComponent";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <div>{ErrorBoundaryComponent(error, reset)}</div>;
}

