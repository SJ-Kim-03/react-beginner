import { useEffect } from "react";
import { useNavigate } from "react-router";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "../../stores";



const supabase = createClient()

export default function AuthCallback() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!session?.user) {
                console.error("세션에 사용자 정보가 없습니다.")
                return;
            }

            const user = session.user;
            if (!user.id) {
                console.error("사용자 ID가 없습니다.")
                return;
            }
            try {
                const { data: existing, error: selectError } = await supabase.from('user').select().eq('id', user.id).single();

                if (!existing) {
                    const { error: insertError } = await supabase
                        .from('user')
                        .insert([
                            { id: user.id, email: user.email, service_agreed: true, privacy_agreed: true, marketing_agreed: false },
                        ])
                    if (insertError) {
                        console.error("사용자 정보 삽입 중 오류:", insertError);
                        return;
                    }
                }
                setUser({
                    id: user.id,
                    email: user.email || "알 수 없는 사용자",
                    role: user.role || "",

                });
                navigate("/");
            } catch (error) {
                console.log(error)
            }
        })

        // 언마운트 시, 구독 해지
        return () => { listener.subscription.unsubscribe() }
    }, [])

    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인 진행 중</main>
}



