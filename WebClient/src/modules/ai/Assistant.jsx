import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addChatMessage } from "../../store/aiSlice";
import { useChatMutation } from "../../api/aiApi";

function AIAssistant() {
 const dispatch = useAppDispatch();
 const chatHistory = useAppSelector((state) => state.ai.chatHistory);
 const [sendMessage, { isLoading }] = useChatMutation();
 const [input, setInput] = useState("");
 const bottomRef = useRef(null);

 useEffect(() => {
 bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [chatHistory]);

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!input.trim() || isLoading) return;

 const userMsg = { role: "user", content: input.trim() };
 dispatch(addChatMessage(userMsg));
 setInput('');

 try {
 const result = await sendMessage({
 messages: [...chatHistory, userMsg]
 }).unwrap();
 dispatch(addChatMessage(result.message));
 } catch {
 dispatch(addChatMessage({ role: "assistant", content: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau." }));
 }
 };

 return (
 <main className="mx-auto flex h-[calc(100vh-5rem)] w-full max-w-5xl flex-col p-3 sm:p-6">
 <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm">
 <header className="flex items-center gap-3 bg-slate-950 px-4 py-4 text-white sm:px-5">
 <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary">
 <Bot className="h-5 w-5" aria-hidden="true" />
 </span>
 <div className="min-w-0">
 <h1 className="truncate font-bold">Trợ lý du lịch ezTravel</h1>
 <p className="truncate text-xs text-slate-300">Địa điểm, dịch vụ và lịch trình trong hệ thống</p>
 </div>
 </header>

 <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-background p-4 sm:p-5" aria-live="polite">
 {chatHistory.length === 0 ? (
 <div className="flex h-full min-h-52 flex-col items-center justify-center text-center">
 <Bot className="h-9 w-9 text-slate-300" aria-hidden="true" />
 <p className="mt-3 text-sm font-medium text-muted-foreground">Bạn muốn lên kế hoạch cho chuyến đi nào?</p>
 </div>
 ) : null}

 {chatHistory.map((message, index) => {
 const isUser = message.role === "user";
 return (
 <div key={`${message.role}-${index}`} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
 {!isUser ? (
 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-white">
 <Bot className="h-4 w-4" aria-hidden="true" />
 </span>
 ) : null}
 <div className={`max-w-[82%] rounded-md px-4 py-3 text-sm leading-6 shadow-sm ${
 isUser
 ? "border border-border bg-background text-foreground"
 : "bg-sky-50 dark:bg-slate-800 text-foreground"
 }`}>
 {message.content}
 </div>
 {isUser ? (
 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-700 text-white">
 <UserRound className="h-4 w-4" aria-hidden="true" />
 </span>
 ) : null}
 </div>
 );
 })}

 {isLoading ? (
 <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
 <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
 <Bot className="h-4 w-4" aria-hidden="true" />
 </span>
 <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
 Đang suy nghĩ...
 </div>
 ) : null}
 <div ref={bottomRef} />
 </div>

 <footer className="border-t border-border bg-background p-3 sm:p-4">
 <form onSubmit={handleSubmit} className="flex gap-2">
 <label htmlFor="assistant-message" className="sr-only">Tin nhắn</label>
 <input
 id="assistant-message"
 type="text"
 className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
 placeholder="Hỏi về địa điểm hoặc lịch trình..."
 value={input}
 onChange={(e) => setInput(e.target.value)}
 disabled={isLoading}
 />
 <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Gửi tin nhắn" title="Gửi tin nhắn">
 <Send className="h-4 w-4" aria-hidden="true" />
 </Button>
 </form>
 <p className="mt-2 text-center text-xs text-muted-foreground">
 Kiểm tra lại giá và tình trạng dịch vụ trước khi đặt.
 </p>
 </footer>
 </section>
 </main>
 );
}

export default AIAssistant;
