import { useNavigate, useSearchParams } from "react-router";
import { AppDraftsDialog, AppSideBar } from "../components/common";
import { SkeletonHotTopic, SkeletonNewTopic } from "../components/skeleton";
import { Button } from "../components/ui/button";
import { CircleSmall, NotebookPen, PencilLine } from "lucide-react";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { TOPIC_STATUS, type Topic } from "@/types/topic.type";
import { NewTopicCard } from "@/components/topics/new-topic";

const supabase = createClient();

// AppHeader, AppFooter, AppSideBar, page, container: 전역 사용 레이아웃 > layout.tsx로 관리
function App() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // const [category, setCategory] = useState<string>(""); // useState 방식
  const [searchParams, setSearchParams] = useSearchParams(); // 쿼리스트링에서 category 값 가져오기
  const category = searchParams.get("category") || ""; // category 값이 없을 경우 빈 문자열로 초기화 > 전체 카테고리

  const [topics, setTopics] = useState<Topic[]>([]);

  const handleCategoryChange = (value: string) => {
    if (value === category) return; // 선택항목 재선택 시 무시
    if (value === "") {
      setSearchParams({}); // 쿼리스트링 초기화 > 전체 카테고리
    } else setSearchParams({ category: value }); // 쿼리스트링에 category 값 설정
  }

  // 발행된 토픽 조회
  const fetchTopics = async () => {
    try {
      let query = supabase.from('topic').select('*').eq('status', TOPIC_STATUS.PUBLISHED);

      if (category && category.trim() !== "") {
        query = query.eq("category", category)
      }; // category 값이 있을 때만 필터링 적용

      const { data: topics, error } = await query;

      if (error) {
        toast.error(error.message);
        return;
      }
      if (topics) {
        setTopics(topics);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 나만의 토픽 생성 버튼 클릭 시 라우팅
  const handleRoute = async () => {
    if (!user) {
      toast.warning("로그인이 필요한 서비스입니다.");
      return;
    }
    const { data, error } = await supabase
      .from('topic')
      .insert([
        {
          status: null,
          title: null,
          content: null,
          category: null,
          thumbnail: null,
          author: user.id,
        }
      ])
      .select();

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success("토픽을 생성하였습니다.")
      navigate(`/topics/${data[0].id}/create`);
    }
  }

  // 첫 렌더링 시 발행된 토픽 조회
  useEffect(() => {
    fetchTopics();
  }, [category]);

  return (
    <main className="w-full h-full min-h-[720px] flex p-6 gap-6">
      <div className="fixed right-1/2 bottom-10 translate-x-1/2 z-20 flex items-center gap-2">
        <Button variant={"destructive"} className="py-5 px-6 rounded-full" onClick={handleRoute}>
          <PencilLine className="text-white" />
          <div className="text-white">나만의 토픽 작성</div>
        </Button>
        <AppDraftsDialog>
          <Button variant="outline" className="w-10 h-10 rounded-full">
            <NotebookPen />
          </Button>
        </AppDraftsDialog>
        <CircleSmall size={14} className="absolute top-0 right-0 text-red-500 " fill="#EF4444" />
      </div>
      {/* 카테고리 사이드바 */}
      <div className="hidden lg:block lg:min-w-60 lg:w-60 lg:h-full">
        <AppSideBar category={category} setCategory={handleCategoryChange} />
      </div>
      {/* 토픽 콘텐츠 */}
      <section className="w-full lg:w-[calc(100%-264px)] flex flex-col gap-12">
        {/* 핫 토픽 */}
        <div className="w-full flex flex-col gap-6">
          <div className='flex flex-col gap-1'>
            <div className="flex items-center gap-2">
              <img src="/assets/icons/icon_002_trending_logo.png" alt="@IMG" className="w-7 h-7" />
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">HOT 토픽</h4>
            </div>
            <p className="md:text-base text-muted-foreground">지금 가장 주목받는 주제들을 살펴보고, 다양한 관점의 인사이트를 얻어보세요.</p>
          </div>
          <div className="w-full flex items-center gap-6 overflow-auto">
            <SkeletonHotTopic />
            <SkeletonHotTopic />
            <SkeletonHotTopic />
            <SkeletonHotTopic />
          </div>
        </div>
        {/* 뉴 토픽 */}
        <div className="w-full flex flex-col gap-6">
          <div className='flex flex-col gap-1'>
            <div className="flex items-center gap-2">
              <img src="/assets/icons/icon_003_writing_logo.png" alt="@IMG" className="w-7 h-7" />
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">NEW 토픽</h4>
            </div>
            <p className="md:text-base text-muted-foreground">새로운 시선으로, 새로운 이야기를 시작하세요. 지금 바로 당신만의 토픽을 작성하세요.</p>
          </div>
          {topics.length > 0 ? (
            <div className="flex flex-col min-h-120 md:grid md:grid-cols-2 gap-6">
              {topics.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((topic: Topic) => {
                return <NewTopicCard key={topic.id} props={topic} />;
              })}
            </div>
          ) : (
            <div className="w-full min-h-120 flex items-center justify-center">
              <p className="text-muted-foreground">조회 가능한 토픽이 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </main >
  );
}

export default App;
