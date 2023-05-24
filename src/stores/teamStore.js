import { create } from "zustand";

export const useTeamStore = create((set) => ({
  fullData: null,
  team: null,
  id: 20,
  info: null,
  statistics: null,
  teamStats: null,
  header: false,
  season: 2022,
  changeStats: (data) => set((state) => ({ statistics: data })),
  changeId: (num) => set((state) => ({ id: num })),
  changeTeam: (data) => set((state) => ({ team: data })),
  changeInfo: (data) => set((state) => ({ info: data })),
  changeFullData: (data) => set((state) => ({ fullData: data })),
  changeTeamStats: (data) => set((state) => ({ teamStats: data })),
  changeHeader: (data) => set((state) => ({ header: data })),
  changeSeason: (data) => set((state) => ({ season: data })),
}));
