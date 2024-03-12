import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { TransitionStartFunction } from "react";

export function handleTransition(
  id: string | undefined,
  name: string | undefined,
  startTransition: TransitionStartFunction,
  router: AppRouterInstance
) {
  // const router = useRouter();
  const url = new URL(window.location.href);

  // Conditional deletion
  if (id === undefined) {
    url.searchParams.delete("id");
  } else {
    url.searchParams.set("id", id);
  }

  if (name === undefined) {
    url.searchParams.delete("name");
  } else {
    url.searchParams.set("name", name);
  }

  startTransition(() => {
    router.replace(url.toString());
  });
  // return null
}
