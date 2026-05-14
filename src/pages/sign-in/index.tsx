import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form"
import { z } from "zod";

import { Button, Input, Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui";
import { NavLink, useNavigate } from "react-router";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";

const formSchema = z.object({
    email: z.email({
        error: "올바른 형식의 이메일 주소를 입력해주세요."
    }),
    password: z.string().min(8, {
        error: "비밀번호는 최소 8자 이상이어야 합니다."
    })
})

const supabase = createClient();

export default function SignIn() {
    const navigate = useNavigate()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange",
    })

    const setUser = useAuthStore((state) => state.setUser)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, } = await supabase.auth.getSession()

            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email as string,
                    role: session.user.role as string
                })
                navigate("/")
            }
        }
        checkSession()
    }, [])

    // 소셜 로그인(Google)
    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                queryParams: { access_type: "offline", prompt: "consent" }, // 약관 동의 옵션
                redirectTo: `${import.meta.env.VITE_SUPABASE_BASE_URL}/auth/callback`
            }
        })
        if (error) toast.error(error.message);
    }

    // 일반 로그인
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("로그인 버튼 클릭");
        try {
            const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            })

            if (error) {
                toast.error(error.message)
            }

            if (user && session) {
                // data: 2개 객체 데이터 전달
                // 1. session
                // 2. user
                setUser({
                    id: user.id,
                    email: user.email as string,
                    role: user.role as string
                })
                toast.success("로그인 성공")
                navigate("/")
            }

        } catch (error) {
            console.log(error)
            throw new Error(`${error}`)
        }
    }

    return (
        <main className="w-full h-full min-h-180 flex items-center justify-center p-6 gap-6">
            <div className="w-100 max-w-1100 flex flex-col px-6 gap-6">
                <div className="flex flex-col">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">로그인</h4>
                    <p className="text-muted-foreground"> 로그인을 위한 정보를 입력해주세요.</p>
                </div>
                <div className="grid gap-3">
                    {/* 소셜 로그인 */}
                    <Button type="button" variant={'secondary'} onClick={handleGoogleSignIn} className="h-10 font-semibold">
                        <img src="/assets/icons/social/icon_001_google_logo.svg" alt="@GOOGLE_LOGO" className="w-[18px] h-[18px] mr-1" />
                        구글 로그인
                    </Button>
                    {/* 경계선 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 text-muted-foreground bg-black uppercase">OR CONTINUE WITH</span>
                        </div>
                    </div>
                    {/* 로그인 폼 */}
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>이메일</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="이메일을 입력하세요."
                                            className="h-10 rounded-md"

                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>비밀번호</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="비밀번호를 입력하세요."
                                            className="h-10 rounded-md"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <div className="w-full flex flex-col gap-3">
                                <Button type="submit" variant={"outline"} className="bg-sky-800/50! h-9">
                                    로그인
                                </Button>
                                <div className="text-center">
                                    계정이 없으신가요?
                                    <NavLink to={"/sign-up"} className="underline ml-1">
                                        회원가입
                                    </NavLink>
                                </div>
                            </div>
                        </FieldGroup>
                    </form>
                </div>
            </div>
        </main >
    )
}

