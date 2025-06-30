import { Message} from "@/component/data/Mockdata";
import React, { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/component/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "@/component/chat/chat";
import { ChatInfo } from "./chat-info";
import { useUIContext } from "@/context/BasicProviders";
interface ChatLayoutProps {
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

export function ChatLayout({
    defaultLayout=[20,60,20],
    defaultCollapsed = false,
    navCollapsedSize
}: ChatLayoutProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const { selectedUser } = useUIContext();
    const [messagesState, setMessages] = React.useState<Message[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
            }}
            className="h-full items-stretch">
            <ResizablePanel
                defaultSize={defaultLayout[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={isMobile ? 0 : 20}
                maxSize={isMobile ? 8 : 30}
                onCollapse={() => {
                    setIsCollapsed(true);
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
                }}
                onExpand={() => {
                    setIsCollapsed(false);
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
                }}
                className={cn(
                    isCollapsed &&
                        "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
                )}>
                <Sidebar
                    isCollapsed={isCollapsed || isMobile}
                    isMobile={isMobile}
                    setMessages={setMessages}
                />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                <Chat
                    messagesState={messagesState}
                    selectedUser={selectedUser}
                    isMobile={isMobile}
                    setMessages={setMessages}
                />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={defaultLayout[2]}
                collapsible={true}
                minSize={isMobile ? 0 : 15}
                maxSize={isMobile ? 0 : 20}>
                <ChatInfo selectedUser={selectedUser} />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
