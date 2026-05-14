import { NavLink, useNavigate } from "react-router";
import { Separator } from "../ui/separator";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

function AppHeader() {
  const Navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const reset = useAuthStore((state) => state.reset);

  const handleLogout = async () => {
    try {
      await reset(); // Zustand + Supabase 세션 모두 초기화

      toast.success("로그아웃 되었습니다.");
      Navigate("/sign-in");
    }
    catch (error) {
      console.error(error);
      console.log("로그아웃 중 오류가 발생했습니다.");
    }
  }


  return (
    <header className="fixed top-0 z-20 w-full flex items-center justify-center bg-[#121212]">
      <div className="w-full max-w-[1328px] flex items-center justify-between px-6 py-3">
        {/* 로고 & 네비게이션 메뉴 UI */}
        <div className="flex items-center gap-5">
          <img
            className="hover:scale-110 transition-all duration-500 cursor-pointer"
            src="/assets/icons/icon_001_rep_logo.svg"
            alt="@LOGO"
            width="20"
            height="20"
          ></img>
          <div className="flex items-center gap-5">
            <NavLink to="/" className="font-semibold text-muted-foreground hover:text-white transition-all duration-500">토픽 인사이트</NavLink>
            <Separator orientation="vertical" className="h-4" />
            <NavLink to="/portfolio" className="font-semibold text-muted-foreground hover:text-white transition-all duration-500">
              포트폴리오
            </NavLink>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-5">
            <span>{user.email}</span>
            <Separator orientation="vertical" className="!h-4" />
            <span onClick={handleLogout} className="font-semibold text-muted-foreground hover:text-white transition-all duration-500 cursor-pointer">
              로그아웃
            </span>
          </div>)
          :
          (
            < NavLink to="/sign-in">
              <div className="font-semibold text-muted-foreground hover:text-white transition-all duration-500">
                로그인
              </div>
            </NavLink>)}
      </div>
    </header >
  );
}

export { AppHeader };
