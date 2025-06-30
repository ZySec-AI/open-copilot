import { UserDataType } from "../data/Mockdata";
import { Avatar, AvatarImage } from "@/component/ui/avatar";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NEW_CHAT_IDS, REQUEST_CHAT_HISTORY } from "@/redux/chat/chatAction";
import { useChatMaster } from "@/redux/chat/chatReducer";
import { API_URL } from "@/constant/config";
import moment from 'moment';
import ChatHistoryList from "./chat-historyList";

export function ChatInfo({ selectedUser }: { selectedUser: UserDataType }) {
    const dispatch = useDispatch();

    const [selected, setSelected] = useState("");
    useEffect(() => {
        if (selectedUser.id) {
            dispatch({ type: REQUEST_CHAT_HISTORY, payload: selectedUser.id });
        }
    }, [selectedUser, dispatch]);
    const { chathistory } = useChatMaster();
    const [groupedHistory, setGroupedHistory] = useState({});

    useEffect(() => {
        setGroupedHistory(Object.groupBy(chathistory, ({ updated_at }: { updated_at: any }) => {
            return formatDate(updated_at);
        }));
    }, [chathistory]);

    function formatDate(dateString: any) {
        const now = moment();
        const date = moment(dateString);
        const daysDifference = now.diff(date, 'days');

        if (daysDifference === 0) {
            return 'Today';
        } else if (daysDifference === 1) {
            return 'Yesterday';
        } else if (daysDifference <= 7) {
            return 'Previous 7 days';
        } else if (daysDifference <= 30) {
            return 'Previous 30 days';
        } else if (daysDifference <= 365) {
            return date.format('MMMM');
        } else {
            return date.format('MMMM YYYY');
        }
    }

    return (
        <div
            className="flex flex-col items-center w-full py-4 gap-5"
            style={{
                backgroundColor: "#f0f7ff",
                padding: "15px",
                height: "100%"
            }}>
            <Avatar className="flex justify-center items-center">
                <AvatarImage
                    src={`${API_URL}/${selectedUser.avatar}`}
                    alt={selectedUser?.expert_name}
                    width={6}
                    height={6}
                />
            </Avatar>
            <Box style={{ width: "100%" }}>
                <h2 className="text-2xl font-semibold text-center border-b border-gray-200 pb-6">{selectedUser?.expert_name}</h2>
                <div
                    style={{
                        overflowY: "auto",
                        height: "calc(100vh - 250px)"
                    }}>
                    {
                        Object.entries(groupedHistory).map(([key, value]) => {
                            return <div key={key}>
                                {key}
                                {(value as any[]).map((chat, index) => (
                                    <ChatHistoryList
                                        key={index}
                                        child={chat.chat_name}
                                        data={chat}
                                        isSelected={selected === chat.id}
                                        onPress={(id) => {
                                            dispatch({ type: NEW_CHAT_IDS, payload: { id: selectedUser.id, addId: false } });
                                            setSelected(id);
                                        }}
                                    />
                                ))}
                            </div>
                        })
                    }
                </div>
            </Box>
        </div>
    );
}
