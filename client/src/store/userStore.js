import { create } from "zustand";
const useUserStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clear: () => set({ user: null }),
}));

export default useUserStore;
