"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { TransitionStartFunction } from "react";

export function handleTransition(
  id: string | undefined,
  name: string | undefined,
  startTransition: TransitionStartFunction,
  router: AppRouterInstance
) {
  const url = new URL(window.location.href);

  // Remove topic reference since index has changed
  url.searchParams.delete("headingid");

  // ✅ Set or remove id
  if (id === undefined || id === null) {
    url.searchParams.delete("id");
  } else {
    url.searchParams.set("id", id);
  }

  // ✅ Set or remove name
  if (name === undefined || name === null) {
    url.searchParams.delete("name");
  } else {
    url.searchParams.set("name", name);
  }

  // 🚫 Avoid full page reloads using shallow routing
  startTransition(() => {
    router.replace(url.toString(), { scroll: false }); // ✅ omit shallow
  });
}
