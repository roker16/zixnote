import { Center } from "@mantine/core";
import { Suspense } from "react";
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
        <Suspense fallback={<p>loading...</p>}>
          <div className="col-span-4">{syllabus}</div>
        </Suspense>
        <div className="col-span-8 ">{moderator}</div>
      </div>
      {children}
    </>
  );
}
