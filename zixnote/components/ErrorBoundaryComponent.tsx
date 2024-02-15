"use client"; // Error components must be Client Components

import { isDevEnvironment } from "@/utils/helper";
import { Alert, Button } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export function ErrorBoundaryComponent(
  error: Error & { digest?: string | undefined },
  reset: () => void
) {
  const icon = <IconInfoCircle />;
  const errorMessage =
    error.message === "23503"
      ? "Can't delete because this is being used somewhere else. Delete all references first."
      : "Something went wrong, Try again.";

  return (
    <Alert variant="light" title="Something went wrong!" icon={icon}>
      {errorMessage}
      {isDevEnvironment && <Alert color="red">{error.message}</Alert>}
      <Button variant="outline" m={"xs"} onClick={reset}>
        Reset
      </Button>
    </Alert>
  );
}
