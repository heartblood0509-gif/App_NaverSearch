import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  Download,
  FileText,
  Lightbulb,
  ListChecks,
  Search,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "사용방법 - Keyword Pick",
  description:
    "Keyword Pick의 개발 배경과 네이버 키워드 검색량 조회, 복사, 파일 내보내기 사용 방법을 쉽게 안내합니다.",
};

const steps = [
  {
    title: "키워드 입력",
    description: "조회하고 싶은 키워드를 한 줄에 하나씩 입력하세요. 쉼표로 구분해서 넣어도 됩니다.",
    icon: FileText,
  },
  {
    title: "검색량 조회",
    description: "검색량 조회 버튼을 누르면 최대 100개 키워드의 PC, 모바일, 합산 검색량을 확인할 수 있습니다.",
    icon: Search,
  },
  {
    title: "결과 정리",
    description: "결과를 복사하거나 CSV, Excel 파일로 내보내 노션이나 메모장에 깔끔하게 정리하세요.",
    icon: ClipboardCheck,
  },
];

const useCases = [
  "블로그 글을 쓰기 전 후보 키워드 검색량 비교",
  "콘텐츠 주제 선정 전 사람들이 많이 찾는 키워드 확인",
  "광고 키워드나 상세페이지 키워드 후보 정리",
  "노션, 메모장, 문서에 키워드 분석 결과 보관",
];

const tips = [
  "넓은 키워드와 구체적인 키워드를 함께 비교해보세요.",
  "검색량이 높다고 무조건 좋은 키워드는 아니므로 경쟁 정도도 같이 보세요.",
  "자주 쓰는 키워드는 파일로 저장해두면 다음 비교가 편합니다.",
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-10 rounded-2xl border bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 p-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-purple-700 shadow-sm ring-1 ring-purple-100">
          <Sparkles className="h-4 w-4" />
          Keyword Pick 사용 가이드
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              키워드 검색량을 더 빠르고 깔끔하게 정리하세요.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Keyword Pick은 네이버 키워드의 월간 PC 검색량, 모바일 검색량, 합산 검색량을
              한 번에 확인하고 보기 좋게 정리할 수 있도록 만든 도구입니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-purple-100">
            <p className="text-sm font-semibold text-purple-700">한 번에 조회 가능</p>
            <p className="mt-2 text-5xl font-black tracking-tight">100개</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              여러 키워드를 반복해서 조회하지 않아도 되도록, 최대 100개까지 일괄 조회할 수 있게 만들었습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </article>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <h2 className="text-2xl font-bold">개발하게 된 배경</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              기존에는 키워드 검색량을 한 번에 최대 5개 정도만 조회할 수 있어서,
              여러 키워드를 확인하려면 같은 작업을 계속 반복해야 했습니다.
            </p>
            <p>
              Keyword Pick은 이 불편함을 줄이기 위해 한 번에 최대 100개 키워드까지
              검색량을 조회할 수 있도록 만들었습니다.
            </p>
            <p>
              또 검색량 결과를 매번 따로 정리하는 것도 번거로웠습니다. 그래서 결과를
              복사해 노션이나 메모장에 붙여넣었을 때 보기 좋게 정리되도록 양식화했습니다.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-purple-600" />
            <h2 className="text-2xl font-bold">사용 방법</h2>
          </div>
          <ol className="space-y-4">
            <li className="rounded-xl bg-muted/50 p-4">
              <p className="font-semibold">1. 키워드를 입력하세요</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                한 줄에 하나씩 입력하거나 쉼표로 구분해서 입력하면 됩니다.
              </p>
            </li>
            <li className="rounded-xl bg-muted/50 p-4">
              <p className="font-semibold">2. 검색량 조회 버튼을 누르세요</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                PC, 모바일, 합산 검색량과 경쟁 정도를 한 번에 확인할 수 있습니다.
              </p>
            </li>
            <li className="rounded-xl bg-muted/50 p-4">
              <p className="font-semibold">3. 결과를 복사하거나 파일로 저장하세요</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                노션, 메모장, 엑셀 등에 붙여넣기 쉽게 정리된 형태로 사용할 수 있습니다.
              </p>
            </li>
          </ol>
        </section>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Download className="h-5 w-5 text-purple-600" />
            <h2 className="text-2xl font-bold">활용 예시</h2>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            {useCases.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-2xl font-bold">사용 팁</h2>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            {tips.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-zinc-950 p-6 text-white shadow-sm">
        <h2 className="text-2xl font-bold">앞으로 업데이트 예정</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
          Keyword Pick은 앞으로도 검색량 비교, 키워드 정리, 복사 양식, 콘텐츠 기획에
          도움이 되는 기능을 계속 업데이트할 예정입니다.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-zinc-950 transition-colors hover:bg-purple-100"
        >
          키워드 조회하러 가기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
