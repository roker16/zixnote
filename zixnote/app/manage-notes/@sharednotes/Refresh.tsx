"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Refresh() {
  const router = useRouter();
  const path = usePathname();
//   useEffect(() => {
//     router.refresh();
//   }, [path,router]);

  return (
    <div>
      {" "}
      <button type="button" onClick={() => router.refresh()}>
        Refresh
      </button>
      {path} 
    </div>
  );
}

export default Refresh;
