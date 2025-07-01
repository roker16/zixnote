import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <>
      {" "}
      <Image src={"/logo.png"} alt={""} width={32} height={32} />
    </>
  );
}

export default Logo;
