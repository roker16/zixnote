"use client";


import { PersonalBook } from "./PersonalBook";

export default function PersonalParent({
  canModerate,
}: {
  canModerate: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row p-1 gap-1 justify-center">
      <PersonalBook canModerate={canModerate} />
    </div>
  );
}
