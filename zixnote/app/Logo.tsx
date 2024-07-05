import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <>
      {" "}
      <Image src={"/logo.png"} alt={""} width={34} height={24} />
    </>
  );
}

export default Logo;
