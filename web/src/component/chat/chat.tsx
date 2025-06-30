import { Message, UserDataType } from "@/component/data/Mockdata";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import { useChatMaster } from "@/redux/chat/chatReducer";
import { API_URL } from "@/constant/config";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { useEffect, useState } from "react";

interface ChatProps {
  messagesState: Message[];
  selectedUser: UserDataType;
  isMobile: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function Chat({
  messagesState,
  selectedUser,
  isMobile,
  setMessages,

}: ChatProps) {
  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
  };
  const { chatSuccess } = useChatMaster();
  const { applications } = useHomeMaster();
  const { chathistory } = useChatMaster();
  useEffect(()=>{
    if(messagesState.length){
      const allAvatars = 
          Object.entries(chatSuccess[chatSuccess.length-1]?.bot ?? {}).map(
            ([responseId, choiceContent]) => ({
              image: `${API_URL}/${applications.find((expert: any) => expert.id === responseId)?.avatar}`,
              id:responseId
            })
          )
    }
  },[messagesState,applications,chatSuccess])
      
  
  function removeDuplicates(array: { [key: string]: any }[], key: string) {
    const uniqueKeys = new Set();
    return array.filter(item => {
      if (!uniqueKeys.has(item[key])) {
        uniqueKeys.add(item[key]);
        return true;
      }
      return false;
    });
  }
 

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar
        selectedUser={selectedUser}
        chathistory={chathistory}
      />
      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
        setMessages={setMessages}
      />
    </div>
  );
}
