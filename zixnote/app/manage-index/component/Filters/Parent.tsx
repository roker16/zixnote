"use client";
import { useState } from "react";
import { Tab } from "@headlessui/react";

export default function Parent() {
  const [activeIndex, setActiveIndex] = useState("my_tabs_1");
  return (
    <div>Parent Filter</div>
  );
}
