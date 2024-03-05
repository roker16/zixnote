"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Refresh from "../Refresh";

function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  return (
    <div>
      <button type="button" onClick={() => router.back()}>
        Go back
      </button>
      {/* <Refresh /> */}
    </div>
  );
}

export default page;
