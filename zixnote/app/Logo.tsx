import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <>
      {" "}
      <Image src={"/logo.png"} alt={""} width={210} height={45} />
    </>
  );
}

export default Logo;
