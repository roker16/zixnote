import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { TransitionStartFunction } from "react";

export function handleTransitionNotes(
  headingId: string | undefined,
  headingName: string | undefined,
  startTransition: TransitionStartFunction,
  router: AppRouterInstance
) {
  // const router = useRouter();
  const url = new URL(window.location.href);

  // Conditional deletion
  if (headingId === undefined) {
    url.searchParams.delete("headingid");
  } else {
    url.searchParams.set("headingid", headingId);
  }

  if (headingName === undefined) {
    url.searchParams.delete("headingname");
  } else {
    url.searchParams.set("headingname", headingName);
  }

  startTransition(() => {
    router.push(url.toString(),{scroll:false});
  });
  // return null
}
