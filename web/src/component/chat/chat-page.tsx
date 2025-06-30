import { ChatLayout } from "@/component/chat/chat-layout";

export function ChatPage() {
    return (
        <div className="flex flex-col items-center justify-center align-middle gap-4 h-[90vh]">
            <div className="border rounded-lg w-full h-full text-sm lg:flex">
                <ChatLayout navCollapsedSize={8} defaultLayout={undefined} />
            </div>
        </div>
    );
}
