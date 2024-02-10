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

interface BearState {
  bears: number;
  increase: (by: number) => void;
  decrease:(by: number) => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  decrease: (by) => set((state) => ({ bears: state.bears + by })),
}));
