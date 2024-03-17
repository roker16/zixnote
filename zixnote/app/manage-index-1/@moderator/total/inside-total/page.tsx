"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Refresh from "../../Refresh";


function Page() {

  const router = useRouter();
  return (
    <div className="bg-red-300">
      <button type="button" onClick={() => router.back()}>
        Go back
      </button>
      <Refresh />
    </div>
  );
}

export default Page;
