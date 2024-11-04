import { create } from "zustand";

type NewCheckoutState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewCheckout = create<NewCheckoutState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
