"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Refresh from "../Refresh";

function page() {
  const router = useRouter();
  return (
    <div>
      <button type="button" onClick={() => router.back()}>
        Go back
      </button>
      <Refresh />
    </div>
  );
}

export default page;
