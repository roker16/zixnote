"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { Suspense } from "react";
import BottomNavigation from "../BottomNav";
export default function ManageSyllabusLayout({
  children,
  filter,
  notes,
  index,
}: {
  children: React.ReactNode;
  filter: React.ReactNode;
  notes: React.ReactNode;
  index: React.ReactNode;
}) {

  return (
    <div>
      
      <div>{filter}</div>
      <div className="grid grid-cols-12 w-full min-h-lvh">
        <div className="col-span-12 md:col-span-4">{index}</div>
        <Suspense fallback={<p>loading...</p>}>
          <div className="col-span-0 md:col-span-8">{notes}</div>
        </Suspense>
      </div>
      {children}
      <BottomNavigation/>
    </div>
  );
}
