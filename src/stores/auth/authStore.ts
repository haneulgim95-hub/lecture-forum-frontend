import type { User } from "../../types/user.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;

    login: (user: User, token: string) => void;
    logout: VoidFunction;
};

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            user: null,
            token: null,
            isLoggedIn: false,
            login: (user, token) => set({ user, token, isLoggedIn: true }),
            logout: () => set({ user: null, token: null, isLoggedIn: false }),
        }),
        { name: "auth-storage" },
    ),
);
