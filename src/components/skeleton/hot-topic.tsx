import { Skeleton } from "../ui";

function SkeletonHotTopic() {
    return <div className="w-full min-w-58 flex flex-col gap-2">
        <Skeleton className="w-full h-70" />
        <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <div className="flex flex-col gap-2">
                <Skeleton className="w-32 h-3" />
                <Skeleton className="w-20 h-3.5" />
            </div>
        </div>
    </div>
}

export { SkeletonHotTopic }
