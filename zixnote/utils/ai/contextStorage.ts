// utils/contextStorage.ts

// type ContextType = "school" | "college" | "exam";

type SchoolContext = {
  type: "school";
  schoolName: string;
  className: string;
  bookName: string;
};

type CollegeContext = {
  type: "college";
  collegeName: string;
  department: string;
  course: string;
};

type ExamContext = {
  type: "exam";
  examName: string;
  paperName: string;
  subjectName: string;
};

export type ActiveContext = SchoolContext | CollegeContext | ExamContext;

const STORAGE_KEY = "activeContext";

export function saveActiveContext(context: ActiveContext) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch (err) {
    console.error("Failed to save context:", err);
  }
}

export function getActiveContext(): ActiveContext | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to parse context:", err);
    return null;
  }
}

export function clearActiveContext() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear context:", err);
  }
}
