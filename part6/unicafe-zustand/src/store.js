import { create } from 'zustand'

const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    increaseGood: () => set((state) => ({ good: state.good + 1 })),
    increaseNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    increaseBad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}))

export const useFeedbackGood = () => useFeedbackStore((store) => store.good)
export const useFeedbackNeutral = () =>
  useFeedbackStore((store) => store.neutral)
export const useFeedbackBad = () => useFeedbackStore((store) => store.bad)
export const useFeedbackControls = () =>
  useFeedbackStore((store) => store.actions)
