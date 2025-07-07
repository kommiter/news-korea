"use client";
import { MagnifyingGlassIcon, UserCircleIcon, PlusIcon, Cog6ToothIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, NewspaperIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, useRef } from "react";
import * as Select from "@radix-ui/react-select";
import React from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiTyped, setAiTyped] = useState("");
  const aiTypingTimeout = useRef<NodeJS.Timeout | null>(null);

  const getPlatformLabel = (value: string) => {
    if (value === "linkedin") return "LinkedIn";
    if (value === "x") return "X";
    if (value === "bluesky") return "Bluesky";
    return value;
  };

  const handlePromptCardClick = (category: string) => {
    setInputValue(`Generate a ${getPlatformLabel(platform)} post about the "${category}" category using your news vector database.`);
  };

  const handleGenerate = async () => {
    if (!inputValue.trim() || loading) return;
    setChatStarted(true);
    setMessages([{ role: "user", content: inputValue }]);
    setLoading(true);
    setAiTyped("");
    // 데모용 더미 답변
    const demoAnswer =
      "Sure! Here's a sample post for the \"culture\" category.\n\nDiscover the latest trends and stories in global culture. Stay inspired and informed with our curated insights! #Culture #Trends #Inspiration";
    // 스켈레톤 1초 후 타이핑 시작
    setTimeout(() => {
      setLoading(false);
      // 한글자씩 타이핑 애니메이션
      let i = 0;
      function typeChar() {
        setAiTyped(demoAnswer.slice(0, i + 1));
        if (i < demoAnswer.length - 1) {
          aiTypingTimeout.current = setTimeout(typeChar, 12 + Math.random() * 30);
          i++;
        } else {
          setMessages([
            { role: "user", content: inputValue },
            { role: "ai", content: demoAnswer },
          ]);
        }
      }
      typeChar();
    }, 1000);
  };

  // Clean up 타이핑 타임아웃
  React.useEffect(() => {
    return () => {
      if (aiTypingTimeout.current) clearTimeout(aiTypingTimeout.current);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 p-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="inline-block w-8 h-8 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-lg" />
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Contents Pipeline</span>
        </div>
        {/* Menu */}
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-white bg-indigo-500 dark:bg-indigo-600 shadow" disabled>
            <NewspaperIcon className="w-5 h-5" />
            실시간 뉴스
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 dark:text-neutral-700 bg-gray-100 dark:bg-neutral-900 cursor-not-allowed font-medium transition" disabled>
            <UserGroupIcon className="w-5 h-5" />
            테크 리더 소식 (개발 중)
          </button>
        </nav>
        {/* Search */}
        <div className="mt-4 mb-6">
          <div className="relative">
            <input
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Search"
              disabled
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
        {/* User */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-neutral-800">
          <UserCircleIcon className="w-8 h-8 text-gray-400 dark:text-neutral-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">Justin Lim</div>
            <div className="text-xs text-gray-400 dark:text-neutral-500">user</div>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
                <ChevronDownIcon className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-2 min-w-[120px]">
              <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer text-gray-800 dark:text-gray-100">설정</DropdownMenu.Item>
              <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer text-gray-800 dark:text-gray-100">로그아웃</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-between px-0 md:px-8 py-8 overflow-y-auto">
        {!chatStarted ? (
          <>
            {/* 상단 모델 선택 및 플랫폼 드롭다운 */}
            <div className="w-full max-w-3xl flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">Select a model</span>
                <button className="ml-2 px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-xs text-gray-500 dark:text-neutral-400">+
                </button>
                <span className="ml-2 text-xs text-gray-400 dark:text-neutral-500">Set as default</span>
              </div>
              {/* 플랫폼 드롭다운 */}
              <Select.Root value={platform} onValueChange={setPlatform}>
                <Select.Trigger className="inline-flex items-center justify-between min-w-[120px] px-3 py-2 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none border border-gray-200 dark:border-neutral-700">
                  <span><Select.Value>{getPlatformLabel(platform)}</Select.Value></span>
                  <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-400 dark:text-neutral-500" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content position="popper" sideOffset={4} className="z-50 bg-white dark:bg-neutral-900 rounded-lg shadow-lg mt-2 min-w-[120px] border border-gray-200 dark:border-neutral-700">
                    <Select.Viewport>
                      <Select.Item value="linkedin" className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800">LinkedIn</Select.Item>
                      <Select.Item value="x" className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800">X</Select.Item>
                      <Select.Item value="bluesky" className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800">Bluesky</Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            {/* 인사말 */}
            <div className="w-full max-w-3xl flex flex-col items-center text-center mb-8">
              <span className="inline-block mb-2">
                <span className="w-10 h-10 inline-flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full">
                  <span className="font-bold text-2xl text-white">CP</span>
                </span>
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hello, Contents Pipeline User</h1>
              <p className="text-xl text-gray-400 dark:text-neutral-500 mb-4">Click a category below to quickly generate content.</p>
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
          <div className="w-full max-w-3xl flex flex-col gap-6 mt-8">
            {/* 대화 메시지 */}
            {messages.length > 0 && (
              <div className="flex flex-col gap-4">
                {/* 유저 메시지 */}
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 px-4 py-2 rounded-xl shadow">
                    {messages[0].content}
                  </div>
                </div>
                {/* AI 메시지 */}
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white px-4 py-2 rounded-xl shadow relative">
                    {loading ? (
                      <SkeletonLine />
                    ) : aiTyped ? (
                      <span>{aiTyped}</span>
                    ) : (
                      messages[1]?.content
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* 채팅 입력창 */}
        <div className="w-full max-w-3xl mt-auto">
          <ChatInput value={inputValue} setValue={setInputValue} onGenerate={handleGenerate} loading={loading} chatStarted={chatStarted} />
        </div>
      </main>
    </div>
  );
}

function PromptCard({ title, desc, onClick }: { title: string; desc: string; onClick?: () => void }) {
  return (
    <div
      className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col gap-2 select-none"
      onClick={onClick}
    >
      <div className="font-semibold text-gray-900 dark:text-white text-base">{title}</div>
      <div className="text-sm text-gray-400 dark:text-neutral-500">{desc}</div>
    </div>
  );
}

function ChatInput({ value, setValue, onGenerate, loading, chatStarted }: { value: string; setValue: (v: string) => void; onGenerate: () => void; loading?: boolean; chatStarted?: boolean }) {
  return (
    <form
      className="flex items-center gap-2 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 py-3 shadow-sm"
      onSubmit={e => {
        e.preventDefault();
        onGenerate();
      }}
    >
      <input
        className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 text-base"
        placeholder="Send a Message"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        autoFocus={!chatStarted}
      />
      <button
        type="submit"
        className="rounded-full p-2 bg-indigo-500 hover:bg-indigo-600 transition text-white shadow-md disabled:opacity-50"
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
    <div className="h-5 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800 animate-pulse rounded" />
  );
}
