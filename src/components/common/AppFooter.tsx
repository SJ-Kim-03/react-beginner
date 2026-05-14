import { Button, Separator } from "../ui";

function AppFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-center bg-[#121212]">
      <div className="w-full max-w-[1328px] flex flex-col gap-6 p-6 pb-18">
        <div className="w-full flex flex-col items-start justify-between gap-6 md:flex-row md:gap-0">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start">
              <h3 className="scroll-m-20 text-base md:text-2xl font-semibold tracking-tight">나의 학습 여정이,</h3>
              <h3 className="scroll-m-20 text-base md:text-2xl font-semibold tracking-tight">나만의 창작으로 이어지는 플랫폼</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={"outline"} size={"icon"} className="border-0">
                <img src="/assets/icons/icon_004_ig_logo.svg" alt="@SNS" className="w-6 h-6 mt-[2px]" />
              </Button>
              <Button variant={"outline"} size={"icon"} className="border-0">
                <img src="/assets/icons/icon_005_youtube_logo.png" alt="@SNS" className="w-[22px] h-[22px]" />
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <p className="cursor-pointer transition-all duration-300 hover:font-medium">이용약관</p>
            <Separator orientation="vertical" className="!h-[14px]" />
            <p className="cursor-pointer transition-all duration-300 hover:font-medium">개인정보 처리방침</p>
            <Separator orientation="vertical" className="!h-[14px]" />
            <p className="cursor-pointer transition-all duration-300 hover:font-medium">클래스 론칭 문의</p>
          </div>
        </div>
        <Separator />
        <div className="w-full flex flex-col items-start justify-between gap-12 md:flex-row md:gap-0">
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col">
              <p className="h-10 text-base font-semibold">고객센터</p>
              <div className="flex flex-col items-start gap-1">
                <p>09:00 - 18:00 (주말 및 공휴일 제외)</p>
                <p>문의: support@company.com</p>
              </div>
            </div>
            <p>@ 2023 Company. All rights reserved.</p>
          </div>
          <div className="flex flex-col mr-[66px]">
            <p className="h-10 text-base font-semibold">사업자 정보</p>
            <div className="flex flex-col items-start gap-1">
              <p>대표이사 : 김영준</p>
              <p>사업자 등록번호 : 123-45-67890</p>
              <p>통신판매신고번호 : 2026-대한민국-0000</p>
              <p>주소 : 서울특별시 강남구 테헤란로 123, 4층</p>
              <p>대표번호 : 02-1234-5678</p>
            </div>
          </div>
        </div>
      </div>
    </footer >
  )
}

export { AppFooter };