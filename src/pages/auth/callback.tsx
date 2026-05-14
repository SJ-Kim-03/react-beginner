import { useEffect } from "react";
import { useNavigate } from "react-router";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";



const supabase = createClient()

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {

        const handleAuthCallback = async () => {
            //1. 현재 세션 정보 가져오기
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession()

            //2. 세션 오류 또는 세션이 없는 경우 처리
            if (sessionError || !session) {
                console.error("세션 처리 중 오류, 다시 로그인 페이지로 리디렉션합니다.", sessionError)
                toast.error("로그인 처리 중 오류가 발생했습니다.")

                // 로그인 페이지로 리디렉션
                navigate("/sign-in")
                return
            }

            // 3. 세션이 정상인 경우 DB 삽입 로직은 이미 Trigger가 처리
            // 별도 public.user 삽입 코드 없이 바로 메인 페이지로 리디렉션

            // 메인 페이지로 리디렉션
            toast.success("로그인을 성공하였습니다.")
            navigate("/")
        }

        // 이 useEffect는 OAuth 리디렉션 후에 실행
        // URL의 "code"나 해시를 통해 Supabase 세션이 이미 저장된 상태일 것
    }, [navigate])


    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인 진행 중</main>
}



