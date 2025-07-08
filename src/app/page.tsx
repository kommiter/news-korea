"use client";
import { MagnifyingGlassIcon, UserCircleIcon, PlusIcon, Cog6ToothIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, NewspaperIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, useRef } from "react";
import * as Select from "@radix-ui/react-select";
import React from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiTyped, setAiTyped] = useState("");
  const aiTypingTimeout = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const getPlatformLabel = (value: string) => {
    if (value === "linkedin") return "LinkedIn";
    if (value === "x") return "X";
    if (value === "bluesky") return "Bluesky";
    return value;
  };

  const handlePromptCardClick = (category: string) => {
    const platformLabel = getPlatformLabel(platform);
    setInputValue(`${platformLabel}에 올릴 '${category}' 카테고리 관련 한국 뉴스를 바탕으로 포스트를 생성해줘.`);
  };

  const handleGenerate = async () => {
    if (!inputValue.trim() || loading) return;
    setChatStarted(true);
    setMessages(prev => [...prev, { role: "user", content: inputValue }]);
    setInputValue("");
    setLoading(true);
    setAiTyped("");
    // sessionId: 최초 1회만 생성
    if (!sessionIdRef.current) {
      const now = new Date();
      const laTime = toZonedTime(now, "America/Los_Angeles");
      const timeStr = format(laTime, "yyyyMMddHHmmss");
      sessionIdRef.current = `id${timeStr}`;
    }
    const sessionId = sessionIdRef.current;
    try {
      const res = await fetch("https://chat-news-korea.conpie.kr/webhook/news-kr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId, chatInput: inputValue }),
      });
      const data = await res.json();
      const answer = data.answer || "(No answer)";
      setLoading(false);
      // 한글자씩 타이핑 애니메이션 (쫘라락)
      let i = 0;
      function typeChar() {
        setAiTyped(answer.slice(0, i + 1));
        if (i < answer.length - 1) {
          aiTypingTimeout.current = setTimeout(typeChar, 5 + Math.random() * 10);
          i++;
        } else {
          setAiTyped("");
          setMessages(prev => [...prev, { role: "ai", content: answer }]);
        }
      }
      typeChar();
    } catch (e) {
      setLoading(false);
      setMessages(prev => [
        ...prev,
        { role: "ai", content: "일시적인 서버 저하로 답변을 생성하지 못했습니다. 다시 시도해주세요." }
      ]);
    }
  };

  // Clean up 타이핑 타임아웃
  React.useEffect(() => {
    return () => {
      if (aiTypingTimeout.current) clearTimeout(aiTypingTimeout.current);
    };
  }, []);

  // 홈으로 돌아가기
  const handleGoHome = () => {
    setChatStarted(false);
    setMessages([]);
    setInputValue("");
    setAiTyped("");
    setLoading(false);
  };

  return (
    <div className="h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <header className="w-full h-16 flex items-center bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 z-10">
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleGoHome}>
          <img src="/conpie.png" alt="logo" className="w-8 h-8 rounded-lg object-cover" />
          <img src="/conpie-letter.png" alt="Contents Pipeline" className="h-7 object-contain" style={{marginLeft: 2}} />
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4">
          {/* Menu */}
          <nav className="flex flex-col gap-2 flex-1">
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg font-medium text-sm transition text-neutral-900 dark:text-neutral-100 bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-none" disabled>
              <NewspaperIcon className="w-5 h-5 text-neutral-500" />
              <span className="text-sm">실시간 한국 뉴스</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-neutral-400 dark:text-neutral-700 bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed font-medium text-sm transition border border-neutral-100 dark:border-neutral-900 shadow-none" disabled>
              <NewspaperIcon className="w-5 h-5 text-neutral-300" />
              <span className="text-sm">실시간 미국 뉴스 (개발 중)</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-neutral-400 dark:text-neutral-700 bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed font-medium text-sm transition border border-neutral-100 dark:border-neutral-900 shadow-none" disabled>
              <UserGroupIcon className="w-5 h-5 text-neutral-300" />
              <span className="text-sm">테크 리더 소식 (개발 중)</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-neutral-400 dark:text-neutral-700 bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed font-medium text-sm transition border border-neutral-100 dark:border-neutral-900 shadow-none" disabled>
              <BookOpenIcon className="w-5 h-5 text-neutral-300" />
              <span className="text-sm">레퍼런스 top-k (개발 중)</span>
            </button>
          </nav>
          {/* User */}
          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <UserCircleIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            <div className="flex-1">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">Justin Lim</div>
              <div className="text-xs text-neutral-400 dark:text-neutral-600">user</div>
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800">
                  <ChevronDownIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow border border-neutral-200 dark:border-neutral-800 p-2 min-w-[120px]">
                <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-neutral-800 dark:text-neutral-200">설정</DropdownMenu.Item>
                <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-neutral-800 dark:text-neutral-200">로그아웃</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </aside>
        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-between px-0 md:px-8 py-8 overflow-y-auto bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
          {!chatStarted ? (
            <>
              {/* 상단 모델 선택 및 플랫폼 드롭다운 */}
              <div className="w-full max-w-3xl flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">Select a model</span>
                  <button className="ml-2 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-400 dark:text-neutral-500">+
                  </button>
                  <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500">Set as default</span>
                </div>
                {/* 플랫폼 드롭다운 */}
                <Select.Root value={platform} onValueChange={setPlatform}>
                  <Select.Trigger className="inline-flex items-center justify-between min-w-[120px] px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium focus:outline-none border border-neutral-200 dark:border-neutral-700">
                    <span><Select.Value>{getPlatformLabel(platform)}</Select.Value></span>
                    <ChevronDownIcon className="w-4 h-4 ml-2 text-neutral-400 dark:text-neutral-500" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content position="popper" sideOffset={4} className="z-50 bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 mt-2 min-w-[120px]">
                      <Select.Viewport>
                        <Select.Item value="linkedin" className="px-4 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">LinkedIn</Select.Item>
                        <Select.Item value="x" className="px-4 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">X</Select.Item>
                        <Select.Item value="bluesky" className="px-4 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">Bluesky</Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
              {/* 인사말 */}
              <div className="w-full max-w-3xl flex flex-col items-center text-center mb-8">
                <span className="inline-block mb-2">
                  <span className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <img src="/conpie.png" alt="logo" className="w-10 h-10 rounded-full object-cover" />
                  </span>
                </span>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Hello, Contents Pipeline User</h1>
                <p className="text-xl text-neutral-400 dark:text-neutral-500 mb-4">Click a category below to quickly generate content.</p>
              </div>
              {/* 추천 프롬프트 카드 */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <PromptCard title="culture" desc="문화 소식" onClick={() => handlePromptCardClick("culture")} />
                <PromptCard title="economy" desc="경제 동향" onClick={() => handlePromptCardClick("economy")} />
                <PromptCard title="entertainment" desc="연예 뉴스" onClick={() => handlePromptCardClick("entertainment")} />
                <PromptCard title="international" desc="해외 이슈" onClick={() => handlePromptCardClick("international")} />
                <PromptCard title="opinion" desc="칼럼/사설" onClick={() => handlePromptCardClick("opinion")} />
                <PromptCard title="politics" desc="정치 뉴스" onClick={() => handlePromptCardClick("politics")} />
                <PromptCard title="science" desc="과학 소식" onClick={() => handlePromptCardClick("science")} />
                <PromptCard title="society" desc="사회 현안" onClick={() => handlePromptCardClick("society")} />
              </div>
            </>
          ) : (
            <div className="w-full max-w-3xl flex flex-col gap-4 mt-8 flex-1 min-h-0">
              {/* 대화 메시지 스크롤 영역 */}
              <div
                className="flex-1 min-h-0 overflow-y-auto pb-4 flex flex-col gap-5 scrollbar-hide"
                style={{ maxHeight: 'calc(100vh - 220px)' }}
              >
                {messages.map((msg, idx) => (
                  <div key={idx} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={
                      msg.role === "user"
                        ? "max-w-[70%] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2 rounded-xl shadow-none border border-neutral-200 dark:border-neutral-700"
                        : "max-w-[70%] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2 rounded-xl shadow-none relative"
                    }>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {/* 타이핑 중인 ai 답변은 별도 말풍선 */}
                {aiTyped && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2 rounded-xl shadow-none relative">
                      <span>{aiTyped}</span>
                    </div>
                  </div>
                )}
                {/* fetch 응답 대기 중에는 스켈레톤 */}
                {loading && !aiTyped && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2 rounded-xl shadow-none relative">
                      <SkeletonLine />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* 채팅 입력창 (sticky/fixed) */}
          <div className="w-full max-w-3xl sticky bottom-0 bg-white dark:bg-neutral-900 z-10 pb-2 pt-2">
            <ChatInput value={inputValue} setValue={setInputValue} onGenerate={handleGenerate} loading={loading} chatStarted={chatStarted} />
          </div>
        </main>
      </div>
    </div>
  );
}

function PromptCard({ title, desc, onClick }: { title: string; desc: string; onClick?: () => void }) {
  return (
    <div
      className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer flex flex-col gap-2 select-none"
      onClick={onClick}
    >
      <div className="font-semibold text-neutral-800 dark:text-neutral-200 text-base">{title}</div>
      <div className="text-sm text-neutral-400 dark:text-neutral-500">{desc}</div>
    </div>
  );
}

function ChatInput({ value, setValue, onGenerate, loading, chatStarted }: { value: string; setValue: (v: string) => void; onGenerate: () => void; loading?: boolean; chatStarted?: boolean }) {
  return (
    <form
      className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 shadow-none"
      onSubmit={e => {
        e.preventDefault();
        onGenerate();
      }}
    >
      <input
        className="flex-1 bg-transparent outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 text-base"
        placeholder="Send a Message"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        autoFocus={!chatStarted}
      />
      <button
        type="submit"
        className="rounded-full p-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition text-neutral-600 dark:text-neutral-300 shadow-none disabled:opacity-50"
        disabled={loading || !value.trim()}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}

function SkeletonLine() {
  return (
    <div className="flex items-center justify-center gap-2 animate-pulse mt-2 min-h-[40px]">
      <span className="inline-block w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700 animate-bounce" />
      <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">답변을 생성하는 중...</span>
    </div>
  );
}

// 글로벌 스타일로 스크롤바 숨기기
import "./scrollbar-hide.css";
