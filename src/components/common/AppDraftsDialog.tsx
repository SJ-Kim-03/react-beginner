import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import dayjs from "dayjs";
import {
    Button,
    Badge,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui";
import { Separator } from "@/components/ui";

import { createClient } from "@/lib/supabase/client";

import { toast } from "sonner";
import { TOPIC_STATUS } from "@/types/topic.type";
import { useNavigate } from "react-router";

interface Props {
    children: React.ReactNode;
}

export function AppDraftsDialog({ children }: Props) {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState<any[]>([]);

    const supabase = createClient()

    const fetchDrafts = async () => {
        if (!user?.id) return;
        try {
            const { data: topic, error } = await supabase
                .from("topic")
                .select("*")
                .eq("author", user.id)
                .eq("status", TOPIC_STATUS.TEMP) // .is는 null 체크, .eq는 정확히 일치하는 값 체크 > 연속 사용

            if (error) {
                toast.error(error.message);
                return;

            }
            if (topic) {
                setDrafts(topic);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user?.id) fetchDrafts();
    }, [])

    return (
        <Dialog>
            <DialogTrigger render={children as React.ReactElement}>
            </DialogTrigger>
            <DialogContent className="bg-background">
                <DialogHeader>
                    <DialogTitle>임시 저장된 토픽</DialogTitle>
                    <DialogDescription>
                        임시 저장된 토픽 목록입니다. 이어서 작성하거나 삭제할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    <div className="flex items-center gap-2">
                        <p>임시 저장</p>
                        <p className="text-green-600 -mr-[6px]">{drafts.length}</p>
                    </div>
                    <Separator />
                    {drafts.length > 0 ? (
                        < div className="min-h-60 h-60 flex flex-col items-center justify-start gap-3 overflow-y-scroll">
                            {drafts.map((draft: any, index: number) => {
                                return (
                                    <div key={draft.id} className="w-full flex items-center justify-between py-2 px-4 gap-3 rounded-md bg-card cursor-pointer hover:bg-card/50" onClick={() => navigate(`/topics/${draft.id}/create`)}>
                                        <div className="flex items-center gap-2">
                                            <Badge className="w-5 h-5 rounded-sm aspect-square text-foreground bg-[#E26F24] shrink-0">{index + 1}</Badge>
                                            <div className="flex flex-col min-w-0">
                                                <p className="line-clamp-1 max-w-[200px] truncate block">{draft.title || "제목 없음"}</p>
                                                <p className="text-xs text-muted-foreground">작성일: {dayjs(draft.created_at).format("YYYY.MM.DD")}</p>
                                            </div>
                                        </div>
                                        <Badge variant={"outline"}>작성중</Badge>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="min-h-60 flex items-center justify-center">
                            <p className="text-muted-foreground/50">조회 가능한 정보가 없습니다.</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose render={<Button variant={"outline"} className="border-0" />}>
                        닫기
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

