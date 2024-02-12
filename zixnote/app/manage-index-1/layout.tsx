// import { Center } from "@mantine/core";

import { Center } from "@mantine/core";

export default function ManageSyllabusLayout({
  children,
  filter,
  moderator,
  syllabus,
}: {
  children: React.ReactNode;
  filter: React.ReactNode;
  moderator: React.ReactNode;
  syllabus: React.ReactNode;
}) {
  return (
    <>
      <Center>{filter}</Center>

      <div className="grid grid-cols-12 w-full min-h-lvh">
        <div className="col-span-4">{syllabus}</div>
        <div className="col-span-8 ">{moderator}</div>
        {/* <div className="col-span-0 ">1</div> */}
      </div>
      {children}
    </>
  );
}
