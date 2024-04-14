"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Link from "next/link";

function Page() {

  const router = useRouter();
  return (
    <div>
      <button type="button" onClick={() => router.back()}>
        Go back
      </button>
      <Link href={"/manage-syll/total/inside-total"}>insdie total</Link>
      {/* <Refresh /> */}
    </div>
  );
}

export default Page;
