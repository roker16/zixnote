"use client";

import { useState } from "react";
import { Exam } from "./Exam";
import { Paper } from "./Paper";
import { Subject } from "./Subject";

export default function ExamParent({ canModerate }: { canModerate: boolean }) {
  const [exam, setExam] = useState<{ id?: number; name?: string }>({});
  const [paper, setPaper] = useState<{ id?: number; name?: string }>({});

  const handleExamChange = (id: number, name: string) => {
    setExam({ id, name });
    setPaper({}); // clear paper if exam changes
  };

  const handlePaperChange = (id: number, name: string) => {
    setPaper({ id, name });
  };

  return (
    <div className="flex flex-col gap-1 p-1">
      <Exam action={handleExamChange} canModerate={canModerate} />
      <Paper
        examId={exam.id}
        action={handlePaperChange}
        canModerate={canModerate}
      />
      <Subject
        examName={exam.name}
        examId={exam.id}
        paperName={paper.name}
        paperId={paper.id}
        canModerate={canModerate}
      />
    </div>
  );
}
