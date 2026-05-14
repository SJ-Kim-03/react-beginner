import { Input, Button } from "../ui"
import { useRef } from "react";
import { Image } from "lucide-react";


interface Props {
    file: File | string | null;
    onChange: (file: File | string | null) => void;
}


export function AppThumbnailUpload({ file, onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 1. 파일 변경 감지 및 부모 컴포넌트로 전달
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.files?.[0] || null);

        // 동일 파일 선택이 불가능 할 수 있으므로 event.target.value 초기화
        event.target.value = "";
    };
    // 2. 이미지 미리보기
    const handleRenderPreview = () => {
        if (typeof file === "string") {
            return <img src={file} alt="@THUMBNAIL" className="w-full aspect-video rounded-lg object-cover" />
        } else if (file instanceof File) {
            return <img src={URL.createObjectURL(file)} alt="@THUMBNAIL" className="w-full aspect-video rounded-lg object-cover" />
        }
        return (
            <div className="w-full aspect-video rounded-lg bg-card flex items-center justify-center">
                <Button size={"icon"} variant={"ghost"} onClick={() => fileInputRef.current?.click()}>
                    <Image />
                </Button>
            </div >
        ); // 기본 이미지
    };
    return (<>
        {handleRenderPreview()}
        <Input type="file" accept="image/*"
            ref={fileInputRef} className="hidden" onChange={handleFileChange} />
    </>)
}