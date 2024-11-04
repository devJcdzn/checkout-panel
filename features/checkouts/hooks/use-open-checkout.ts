import { create } from "zustand";

type OpenCheckoutState = {
  hash?: string;
  isOpen: boolean;
  onOpen: (hash: string) => void;
  onClose: () => void;
};

export const useOpenCheckout = create<OpenCheckoutState>((set) => ({
  hash: undefined,
  isOpen: false,
  onOpen: (hash: string) => set({ isOpen: true, hash }),
  onClose: () => set({ isOpen: false, hash: undefined }),
}));
