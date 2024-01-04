"use client";
import React from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { options } from "./options";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const SunEditorTest = () => {
  return (
    <div>
      <p> My Other Contents </p>
      <SunEditor setOptions={options} hideToolbar={false} />
    </div>
  );
};
export default SunEditorTest;
