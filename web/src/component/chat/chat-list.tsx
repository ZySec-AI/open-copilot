import { Message, UserData, UserDataType } from "@/component/data/Mockdata";
import { cn } from "@/lib/utils";
import { Copy, CheckCheck } from "lucide-react";
import React, { useRef, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { useChatMaster } from "@/redux/chat/chatReducer";
import { useAuthMaster } from "@/redux/auth/authReducer";
import ReactMarkdown from "react-markdown";
import "@mdxeditor/editor/style.css";
import ChatGlobal from "./chat-global";
import { useHomeMaster } from "@/redux/home/homeReducer";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "@/component/ui/tooltip";
import { PulseLoader } from "react-spinners";
import { Spinner } from "@/component/ui/spinner";
import TypingAnimation from "../global/TypingAnimation";
import { useDispatch } from "react-redux";
import { REQUEST_CHATID_DATA } from "@/redux/chat/chatAction";
import { API_URL } from "@/constant/config";

interface ChatListProps {
  messages: Message[];
  selectedUser: UserDataType;
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isQuestionActive?: boolean;

}

interface ChoiceContent {
  id?: number;
  text?: string;
  replace?: any;
}

export function ChatList({
  messages,
  selectedUser,
  sendMessage,
  isMobile,
  setMessages,

  
}: ChatListProps) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { chatSuccess, typingIndicator, chathistory, chatLoading, newChatIds } =useChatMaster();
  const { retrieveUser } = useAuthMaster();
  const { applications } = useHomeMaster();
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    if (messages?.length > 0) {
      setIsLoading(false);
    }
  }, [messages]);

  React.useEffect(() => {
    if (chathistory?.length == 0) {
      setIsLoading(false);
    }
  }, [chathistory]);

  React.useEffect(() => {
    if (!newChatIds.includes(selectedUser.id)) {
      setIsLoading(true);
    }
  }, [selectedUser.id]);

  React.useEffect(() => {
    let newMessage = {
      message: chatSuccess.user,
      bot: chatSuccess.bot,
    };
    messages[messages?.length - 1] = newMessage;
    setMessages([...chatSuccess]);
  }, [chatSuccess]);

  React.useEffect(() => {
    if (chatSuccess && typeof chatSuccess === 'object') {
      const responseIds = Object.keys(chatSuccess);
  
    }
  }, [chatSuccess]);

  React.useEffect(() => {
    if (chathistory.length > 0 && !newChatIds.includes(selectedUser.id)) {
      const firstChat = chathistory[0];
      dispatch({ type: REQUEST_CHATID_DATA, payload: firstChat?.id });
    }
  }, [chathistory]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        {isLoading ? (
          <Spinner size="large" />
        ) : (
          <AnimatePresence>
            {messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                      type: "spring",
                      bounce: 0.3,
                      duration: messages.indexOf(message) * 0.05 + 0.2,
                    },
                  }}
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  className={cn(
                    "group flex flex-col gap-2 p-4 whitespace-pre-wrap"
                  )}
                >
                  <div className="items-end flex justify-end">
                    <div className="bg-accent p-3 rounded-md max-w-xs">
                      {message.message}
                    </div>
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-500 rounded-full dark:bg-gray-600">
                      <span className="text-lg text-gray-50 dark:text-gray-300">
                        {retrieveUser.full_name
                          ? retrieveUser.full_name.charAt(0).toUpperCase()
                          : ""}
                      </span>
                    </div>
                  </div>
                  {chatSuccess[index]?.bot &&
                    Object.entries(chatSuccess[index].bot).map(
                      ([responseId, choiceContent]) => (
                        (
                          <div key={responseId} className="justify-start">
                            <div className="items-start flex">
                              {applications && applications.length > 0 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Avatar className="">
                                        <Avatar
                                          style={{
                                            width: 45,
                                            height: 45,
                                            backgroundColor: "#f0f0f0",
                                            overflow: "hidden",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <AvatarImage
                                            src={`${API_URL}/${applications.find((expert: any) => expert.id === responseId)?.avatar}`}
                                            alt={
                                              applications.find(
                                                (expert: any) =>
                                                  expert.id === responseId
                                              )?.expert_name
                                            }
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "cover",
                                              borderRadius: "50%",
                                            }}
                                          />
                                        </Avatar>
                                      </Avatar>
                                    </TooltipTrigger>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              <ul>
                                {(choiceContent as ChoiceContent[]).map(
                                  (
                                    content: ChoiceContent,
                                    choiceIndex: number
                                  ) => {
                                    let modifiedContent = content?.replace(
                                      /(\r\n|\n|\r){2,}/g,
                                      "\n"
                                    );
                                    if (!/\n/.test(modifiedContent)) {
                                      modifiedContent = modifiedContent.replace(
                                        /(.+?)(\n|$)/g,
                                        "$1\n\n"
                                      );
                                    }

                                    return (
                                      <li key={choiceIndex}>
                                        <div className="ml-1 text-xs mt-2 font-semibold text-gray-500">
                                          {
                                            applications.find(
                                              (expert: any) =>
                                                expert.id === responseId
                                            )?.expert_name
                                          }
                                        </div>
                                        <div
                                          className="bg-accent p-3 rounded-md w-70 mt-2"
                                          style={{
                                            width: "50rem",
                                          }}
                                        >
                                          {message?.chat_id ? (
                                            <TypingAnimation
                                              text={modifiedContent}
                                            />
                                          ) : (
                                            <ReactMarkdown>
                                              {modifiedContent}
                                            </ReactMarkdown>
                                          )}
                                        </div>
                                        <div className="group-hover:opacity-100 opacity-0 transition-opacity ease-in duration-200 w-full flex justify-end flex-row gap-2 py-2 ps-6">
                                          {isCopied ? (
                                            <CheckCheck className="text-muted-foreground h-5" />
                                          ) : (
                                            <Copy
                                              className="text-muted-foreground h-5 cursor-pointer"
                                              onClick={() =>
                                                handleCopy(modifiedContent)
                                              }
                                            />
                                          )}
                                        </div>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          </div>
                        )
                      )
                    )}
                </motion.div>
              ))
            ) : (
              <div className="flex justify-center m-auto text-3xl font-bold">
                <ChatGlobal />
              </div>
            )}
          </AnimatePresence>
        )}
        {typingIndicator && (
          <div className="flex p-4 items-center">
            <Avatar className="">
              <AvatarImage
                src={`/${selectedUser.avatar}`}
                alt={selectedUser?.name}
                width={6}
                height={6}
              />
            </Avatar>
            <PulseLoader
              color="#c3cfdb"
              cssOverride={{}}
              loading
              margin={2}
              size={10}
              speedMultiplier={1}
            />
          </div>
        )}
      </div>
      <ChatBottombar
        sendMessage={sendMessage}
        isMobile={isMobile}
        selectedUser={selectedUser}
        message={message}
        setMessage={setMessage}
        showStaticQuestions={
          (!chatLoading && chathistory?.length == 0 && messages?.length == 0) ||
          newChatIds.includes(selectedUser.id)
        }
      />
    </div>
  );
}
