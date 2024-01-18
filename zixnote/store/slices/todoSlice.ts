import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
)