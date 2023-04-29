import { create } from "zustand";

export const useTeamStore = create((set) => ({
  team: null,
  id: 99,
  info: null,
  changeId: (num) => set((state) => ({ id: num })),
  changeTeam: (data) => set((state) => ({ team: data })),
  changeInfo: (data) => set((state) => ({ info: data })),
}));
