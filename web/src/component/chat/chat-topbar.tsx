import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserDataType } from "@/component/data/Mockdata";
import ChatExpertModal from "../modal/ChatExpertModal";
import { BsPlus } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { useChatMaster } from "@/redux/chat/chatReducer";
import { useDispatch } from "react-redux";
import { API_URL } from "@/constant/config";
import { toast } from "sonner";
import { useHomeMaster } from "@/redux/home/homeReducer";
import chatServices from "@/services/chat.services";

interface ChatTopbarProps {
  selectedUser?: UserDataType;
  chathistory: {
    id: string;
    created_at: string;
    updated_at: string;
    expert_ids: string[];
    chat_name: string;
  }[];
}

function ChatTopbar({
  selectedUser,
  chathistory,
}: ChatTopbarProps) {
  const { chatId } = useChatMaster();
  const { newChatIds, chatSuccess } = useChatMaster();
  const { applications } = useHomeMaster();
  const [expertModal, setExpertModal] = useState(false);
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);
  const [filteredAvatars, setFilteredAvatars] = useState<
    { id: string; image: string }[]
  >([]);
  const [chatName, setChatName] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedUser) {
      if (newChatIds.includes(selectedUser.id)) {
        setChatName(selectedUser.expert_name);
      } else {
        for (const chat of chathistory) {
          if (chat.expert_ids.includes(selectedUser.id)) {
            setChatName(chat.chat_name);
            break;
          }
        }
      }
    }
  }, [selectedUser, chathistory, newChatIds]);
console.log(chathistory,'----')
  useEffect(() => {
    if (chatSuccess.length) {
      const allAvatars = Object.entries(chatSuccess[chatSuccess.length - 1]?.bot ?? {}).map(
        ([responseId, choiceContent]) => ({
          image: `${API_URL}/${applications.find((expert: any) => expert.id === responseId)?.avatar}`,
          id: responseId
        })
      )
      setFilteredAvatars(allAvatars);
    }
  }, [applications, chatSuccess]);

  const removeExpert = async (user: any) => {
    if (selectedUser && user.id === selectedUser.id) {
      toast.error("You cannot remove this Expert");
      return;
    }

    if (chatId) {
      try {
        const response = await chatServices.removeExpert(user.id, chatId);
        if (response?.data?.expert_ids?.length) {
          handleExperts(response.data.expert_ids, false);
        }
        toast.success("Expert removed successfully");
      } catch (error) {
        toast.error("Failed to remove expert");
      }
    } else {
      toast.error("You cannot remove an expert without a chat id");
    }
  };

  const handleExperts = (expert_ids: string[], isAdd: boolean = true) => {
    if (filteredAvatars.length) {
      if (!isAdd) {
        const newExpert = filteredAvatars.filter((expert) =>
          expert_ids.includes(expert.id)
        );
        setFilteredAvatars(newExpert);
        return;
      }
      expert_ids.forEach((id) => {
        const expert = filteredAvatars.find((expert) => expert.id === id);

        if (!expert) {
          setFilteredAvatars([
            ...filteredAvatars,
            {
              id,
              image: `${API_URL}/${applications.find((expert: any) => expert.id === id)?.avatar}`,
            },
          ]);
        }
      });
    }
  };

  const chatNameParts = chatName ? chatName.split(":") : [];
  const prefix = chatNameParts.length > 0 ? chatNameParts[0] + ":" : "";
  const remainingText =
    chatNameParts.length > 1 ? chatNameParts.slice(1).join(":").trim() : "";

  return (
    <>
      <div className="w-full h-20 flex p-4 justify-between items-center border-b">
        <div>
          {selectedUser?.id && (
            <div className="flex items-center">
              <div className="flex flex-col ml-3">
                {chatName && prefix !== "Group Chat:" ? (
                  <>
                    <div className="text-lg font-semibold">
                      {selectedUser.expert_name} 
                    </div>
                    <div>{selectedUser.description}</div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-semibold">{prefix}</div>
                    <div>{remainingText}</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-xl font-bold flex">
          <div>
            {selectedUser && (
              <div className="flex items-center">
                <div className="flex -space-x-4">
                  {filteredAvatars.map(
                    (user, index) => (
                      <div
                        key={index}
                        className="relative flex justify-center items-center w-10 h-10 border-2 border-white rounded-full"
                        onMouseEnter={() => setHoveredAvatar(index)}
                        onMouseLeave={() => setHoveredAvatar(null)}
                      >
                        <Avatar className="w-10 h-10 rounded-full">
                          <AvatarImage
                            src={user.image}
                            alt={chatName || selectedUser?.expert_name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        </Avatar>
                        {hoveredAvatar === index && (
                          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-full">
                            <MdOutlineCancel
                              onClick={() => {
                                removeExpert(user);
                              }}
                              className="text-white cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <BsPlus
            style={{
              fontSize: "2rem",
              marginTop: "4px",
              marginLeft: "10px",
              color: "black",
            }}
            className="bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
            onClick={() => setExpertModal(true)}
          />
        </div>
      </div>
      <ChatExpertModal
        handleExperts={handleExperts}
        open={expertModal}
        handleClose={() => setExpertModal(false)}
      />
    </>
  );
}

export default React.memo(ChatTopbar);
