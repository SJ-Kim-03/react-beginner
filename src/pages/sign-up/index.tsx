import { useAuthStore } from "@/stores";
import { createClient } from "@/lib/supabase/client"

import { NavLink, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form"
import { useState } from "react";
import { useEffect } from "react";
import { z } from "zod";

import { Button, Input, Field, FieldLabel, FieldError, FieldGroup, Label, Checkbox, Separator } from "@/components/ui";
import { ArrowLeft, Asterisk, ChevronRight } from "lucide-react";
import { toast } from "sonner";


const supabase = createClient() // Supabase 클라이언트 인스턴스 생성

const formSchema = z
    .object({
        email: z.email({
            error: "올바른 형식의 이메일 주소를 입력해주세요."
        }),
        password: z.string().min(8, {
            error: "비밀번호는 최소 8자 이상이어야 합니다."
        }),
        confirmPassword: z.string().min(8, {
            error: "비밀번호를 다시 한 번 입력해주세요."
        })
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "비밀번호가 일치하지 않습니다.",
                path: ["confirmPassword"]
            });
        }
    });


export default function SignUp() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onChange",
    })

    const [serviceAgreed, setServiceAgreed] = useState<boolean>(false); // 서비스 이용약관 동의 여부
    const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false); // 개인정보 수집 및 이용동의 여부
    const [marketingAgreed, setMarketingAgreed] = useState<boolean>(false); // 마케팅 및 광고 수신 동의 여부

    const handleCheckService = () => setServiceAgreed(!serviceAgreed);
    const handleCheckPrivacy = () => setPrivacyAgreed(!privacyAgreed);
    const handleCheckMarketing = () => setMarketingAgreed(!marketingAgreed);

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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("회원가입 버튼 클릭");

        const supabase = createClient()

        if (!serviceAgreed || !privacyAgreed) {
            // 필수 동의 항목이 체크되지 않은 경우 - Toast UI 발생
            toast.warning("필수 동의항목을 체크해주세요.");
            return;
        }

        try {
            const { data: { user, session }, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password
            });

            if (error) { // API 호출 과정에서 에러
                // 에러 메시지 - Toast UI 발생
                toast.error(error.message);
                return;
            }
            // 회원가입 성공
            if (user && session) {
                const { data, error } = await supabase
                    .from('user')
                    .upsert([
                        { id: user.id, email: values.email, service_agreed: serviceAgreed, privacy_agreed: privacyAgreed, marketing_agreed: marketingAgreed },
                    ], { onConflict: 'id' })
                    .select()

                if (data) {
                    // 성공 메시지 - Toast UI 발생
                    toast.success("회원가입이 완료되었습니다.")
                    // 로그인 페이지로 리다이렉트
                    navigate("/sign-in");

                }
                if (error) { // API 호출 과정에서 에러
                    // 에러 메시지 - Toast UI 발생
                    toast.error(error.message);
                    return;
                }
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(`${error}`)
        } // js에서 처리

    }
    return (
        <main className="w-full h-full min-h-180 flex items-center justify-center p-6 gap-6">
            < div className="w-100 max-w-1100 flex flex-col px-6 gap-6" >
                <div className="flex flex-col">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">회원가입</h4>
                    <p className="text-muted-foreground"> 회원가입을 위한 정보를 입력해주세요.</p>
                </div>
                <div className="grid gap-3">
                    {/* 경계선 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 text-muted-foreground bg-black uppercase">USER INFORMATION</span>
                        </div>
                    </div>
                    {/* 회원가입 폼 */}
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
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>비밀번호 확인</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="비밀번호를 다시 입력하세요."
                                            className="h-10 rounded-md"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <div className="grid gap-2">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-1">
                                        <Asterisk size={14} className="text-[#F96859]" />
                                        <Label>필수 동의항목</Label>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="w-full flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    className="w-[18px] h-[18px] checked"
                                                    checked={serviceAgreed}
                                                    onCheckedChange={handleCheckService}
                                                />
                                                서비스 이용약관 동의
                                            </div>
                                            <Button variant={"link"} className="!p-0 gap-1">
                                                <p>자세히 보기</p>
                                                <ChevronRight className="mt-[2px]" />
                                            </Button>
                                        </div>
                                        <div className="w-full flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox className="w-[18px] h-[18px]"
                                                    checked={privacyAgreed} onCheckedChange={handleCheckPrivacy} />
                                                개인정보 수집 및 이용동의
                                            </div>
                                            <Button variant={"link"} className="!p-0 gap-1">
                                                <p>자세히 보기</p>
                                                <ChevronRight className="mt-[2px]" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid gap-2">
                                    <Label>선택 동의항목</Label>
                                    <div className="flex flex-col">
                                        <div className="w-full flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox className="w-[18px] h-[18px]" checked={marketingAgreed} onCheckedChange={handleCheckMarketing} />
                                                마케팅 및 광고 수신 동의
                                            </div>
                                            <Button variant={"link"} className="!p-0 gap-1">
                                                <p>자세히 보기</p>
                                                <ChevronRight className="mt-[2px]" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant={"outline"} size={"icon"}>
                                        <ArrowLeft></ArrowLeft>
                                    </Button>
                                    <Button type="submit" variant={"outline"} className="flex-1 bg-sky-800/50! h-9">
                                        회원가입
                                    </Button>
                                </div>
                                <div className="text-center">
                                    계정이 있으신가요?
                                    <NavLink to={"/sign-in"} className="underline ml-1">
                                        로그인
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
