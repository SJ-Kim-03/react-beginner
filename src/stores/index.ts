import { createClient } from "@/lib/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zustand 예시 코드
// const useBear = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
// }));

// persist 기능
// state를 브라우저의 스토리지(Local or Session)에 저장 > 새로고침, 다시 열어도 상태 유지
// 이 미들웨어를 사용해 Zustand store의 데이터를 브라우저 스토리지에 저장 가능
// 이를 통해 상태 유지(persist) 할 수 있어, 예를 들어 로그인 상태, 장바구니, 테마 설정 등 페이지를 새로고침해도 유지되게 할 수 있다.

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null; // 로그아웃 시점에는 null로 초기화
  setUser: (newUser: User | null) => void;
  reset: () => Promise<void>;
}

const supabase = createClient(); // 한 번만 생성

// export const useAuthStore = create<AuthStore>((set) => ({
//   id: "",
//   email: "",
//   role: "",

//   setID: (newID) => set({ id: newID }),
//   setEmail: (newEmail) => set({ email: newEmail }),
//   setRole: (newRole) => set({ role: newRole }),

//   reset: () => set({ id: "", email: "", role: "" }),
// }));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: {
        id: "",
        email: "",
        role: "",
      },
      setUser: (newUser: User | null) => set({ user: newUser }),

      // 로그아웃 (상태 + Supabase 세션 모두 초기화)
      reset: async () => {
        await supabase.auth.signOut(); // Supabase 세션 초기화

        set({ user: null }); // Zustand 상태 초기화
        localStorage.removeItem("auth-storage");
      },
    }),
    { name: "auth-storage", partialize: (state) => ({ user: state.user }) }, // user만 저장
  ),
);
