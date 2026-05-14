import { ArrowLeft, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Separator } from "@/components/ui"
import { useNavigate, useParams } from "react-router";
import { AppEditor } from "@/components/common/AppEditor";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { TOPIC_CATEGORY } from "@/constants/category.constant";

export default function TopicDetail() {

    const navigate = useNavigate();
    const { id } = useParams();
    const user = useAuthStore((state) => state.user);

    const [author, setAuthor] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [thumbnail, setThumbnail] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const fetchTopic = async () => {
        const supabase = createClient();
        try {
            const { data: topic, error } = await supabase
                .from('topic')
                .select('*')
                .eq('id', id)
            if (error) {
                toast.error(error.message);
                return;
            }
            if (topic) {
                setAuthor(topic[0].author);
                setTitle(topic[0].title);
                setCategory(topic[0].category);
                setThumbnail(topic[0].thumbnail);
                setContent(topic[0].content);
            }

        } catch (error) { console.log(error); throw error; }
    };

    const handleDelete = async () => {
        const supabase = createClient();
        try {
            const { error } = await supabase
                .from('topic')
                .delete()
                .eq('id', id)
            if (error) {
                toast.error(error.message);
                return;
            }
            toast.success("토픽이 삭제되었습니다.");
            navigate('/');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    useEffect(() => {
        fetchTopic();
    }, [id]); // id가 변경될 때마다 토픽 데이터를 다시 불러옴

    return (
        <main className="w-full h-full min-h-[720px] flex flex-col">
            {/* 썸네일 부분 */}
            <div className="relative w-full h-60 md:h-100 bg-cover bg-[50%_35%] bg-accent" style={{ backgroundImage: `url(${thumbnail})` }}>
                {/* 뒤로 가기 */}
                <div className="absolute top-6 left-6 z-10 flex items-center gap-2" >
                    <Button variant="outline" size="icon" onClick={() => navigate('/')} >
                        <ArrowLeft />
                    </Button>
                    {/* 토픽 작성자의 user_id와 로그인한 사람의 user_id가 같은 경우에만 삭제 버튼이 보이도록 */}
                    {author === user?.id && (

                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Trash2 />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        삭제 후에는 복구가 불가능합니다.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>닫기</AlertDialogCancel>
                                    <AlertDialogAction className="!bg-red-800/50 text-white hover:bg-red-700/50" onClick={handleDelete}>
                                        삭제
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
                {/* 좌, 우, 하단 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>
            <section className="relative w-full flex flex-col items-center -mt-40">
                <span className="mb-4">
                    {TOPIC_CATEGORY.find((item) => item.category === category)?.label ?? category}
                </span>
                <h1 className="scroll-m-20 text-center font-extrabold tracking-tight text-xl sm:text-2xl md:text-4xl">{title}</h1>
                <Separator className="!w-6 my-6 bg-foreground" />
                <span>2026.05.13</span>
            </section>
            {/* 에디터 내용을 불러와 렌더링 */}
            <div className="w-full py-6">
                {content && (
                    <AppEditor props={JSON.parse(content)} readonly />
                )}
            </div>
        </main>
    )
}
