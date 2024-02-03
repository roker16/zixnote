"use client";

import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="filled" type="submit">
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}
