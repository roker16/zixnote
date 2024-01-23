"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn"
    >
      {pending?<div className="loading"></div>: "Submit"}
    </button>
  );
}
