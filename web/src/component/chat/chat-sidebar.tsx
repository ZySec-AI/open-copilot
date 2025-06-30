import { cn } from "@/lib/utils";
import { buttonVariants } from "@/component/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/component/ui/tooltip";
import { Avatar, AvatarImage } from "@/component/ui/avatar";
import { Message } from "@/component/data/Mockdata";
import { Link } from "react-router-dom";
import CustomChatEditButton from "../global/ChatEditButton";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { useUIContext } from "@/context/BasicProviders";
import { REQUEST_GET_APPLICATION } from "@/redux/home/homeAction";
import { NEW_CHAT } from "@/redux/chat/chatAction";
import { API_URL } from "@/constant/config";

interface SidebarProps {
    isCollapsed: boolean;
    links?: {
        name: string;
        messages: Message[];
        avatar: string;
        variant: "grey" | "ghost";
    }[];
    onClick?: () => void;
    isMobile: boolean;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function Sidebar({ isCollapsed, setMessages }: SidebarProps) {
    const { hndleSelecteuser, setSelectedUser, selectedUser } = useUIContext();
    const [active, setActive] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: REQUEST_GET_APPLICATION });
        dispatch({ type: NEW_CHAT });
    }, [dispatch]);

    const { applications } = useHomeMaster();
    useEffect(() => {
        if (Object.keys(selectedUser).length === 0) {
            setSelectedUser(applications[0] || {});
        }
    }, [applications]);

    return (
        <div
            data-collapsed={isCollapsed}
            className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
            style={{
                backgroundColor: "#f0f7ff",
                border: "2px solid #ECEAEE"
            }}>
            {!isCollapsed && (
                <div className="flex justify-between p-2 items-center">
                    <div className="flex gap-2 items-center text-2xl">
                        <p className="font-medium">ZySec.AI Experts</p>
                        <span className="text-zinc-300">({applications.length})</span>
                    </div>

                    <div className="flex gap-2 items-center">
                        <Link
                            to="#"
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "h-9 w-9"
                            )}>
                            <CustomChatEditButton setMessages={setMessages} />
                        </Link>
                    </div>
                </div>
            )}
            <nav style={{ overflowY: 'auto' }}
                className="mb-2 grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {applications.map((link: any, index: number) =>
                    isCollapsed ? (
                        <TooltipProvider key={index}>
                            <Tooltip  delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        onClick={() => hndleSelecteuser(link)}
                                        to="#"
                                        className={cn(
                                            buttonVariants({ variant: link.variant, size: "icon" }),
                                            "h-11 w-11 md:h-16 md:w-16",
                                            "bg-muted text-black hover:bg-muted hover:text-black shrink",
                                            "justify-start gap-4"
                                        )}
                                        style={{ marginBottom: "10px" }}>

                                        <img
                                            src={`${link.avatar}`}
                                            id="new"
                                            alt={link.avatar}
                                            width={6}
                                            height={6}
                                            className="w-10 h-10 "
                                        />

                                        <span className="sr-only">{link.expert_name}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="flex items-center gap-4">
                                    {link.expert_name}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <div key={index} className={`flex  border border-gray-200 rounded-lg bg-${active === link ? "blue" : ""}-100`}>
                            <Link
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActive(link);
                                    dispatch({ type: NEW_CHAT }), hndleSelecteuser(link);
                                }}
                                key={index}
                                to="#"
                                className={cn(
                                    buttonVariants({ variant: link.variant, size: "lg" }),
                                    "bg-muted text-black hover:bg-muted hover:text-black shrink",
                                    "justify-start gap-4"
                                )}
                                style={{
                                    margin: "10px", width: "95%", background: "transparent", paddingLeft: "1rem", paddingRight: "1rem",
                                    boxShadow: "none", borderBottom: "1px solid #0000", borderRadius: "0"
                                }}>
                                <Avatar className="flex justify-center items-center">
                                    <AvatarImage
                                        src={`${API_URL}/${link.avatar}`}
                                        alt={link.avatar}
                                        width={6}
                                        height={6}
                                        className="w-10 h-10"
                                    />
                                </Avatar>
                                <div className="flex flex-col max-w-28">
                                    <span>{link.expert_name}</span>
                                </div>
                            </Link>
                        </div>
                    )
                )}
            </nav>
        </div>
    );
}
