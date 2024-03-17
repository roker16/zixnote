"use client";
import { useSelectedLayoutSegment } from "next/navigation";
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
  const loginSegments = useSelectedLayoutSegment("moderator");
  return (
    <div>
      {loginSegments}
      <div>{filter}</div>
      <div className="grid grid-cols-12 w-full min-h-lvh">
        <div className="col-span-12 md:col-span-4">{syllabus}</div>
        <Suspense fallback={<p>loading...</p>}>
          <div className="col-span-0 md:col-span-8">{moderator}</div>
        </Suspense>
      </div>
      {children}
    </div>
  );
}
