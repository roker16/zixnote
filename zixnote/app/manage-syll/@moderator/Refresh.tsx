"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Refresh() {
  const router = useRouter();
  const path = usePathname();
  const [counter, setCounter] = useState(0);
  //   useEffect(() => {
  //     router.refresh();
  //   }, [path,router]);

  return (
    <div>
      {counter}
      <button type="button" onClick={() => router.refresh()}>
        Refresh
      </button>
      <button onClick={() => setCounter(counter + 1)}>increase</button>
      {path}
    </div>
  );
}

export default Refresh;
