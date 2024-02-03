import { create, StateCreator } from "zustand";

type Syllabus = {
  id: number;
  name: string;
};

interface SyllabusSlice {
  syllabus: Syllabus | null;
  updateSyllabus: (syllabus: Syllabus | null) => void;
}

const createSyllabusSlice: StateCreator<
  SyllabusSlice,
  [],
  [],
  SyllabusSlice
> = (set) => ({
  syllabus: null,
  updateSyllabus: (x) =>
    set((state) =>
      x
        ? {
            syllabus: x,
          }
        : { syllabus: null }
    ),
});

export const useBoundStore = create<SyllabusSlice>()((...a) => ({
  ...createSyllabusSlice(...a),
}));
