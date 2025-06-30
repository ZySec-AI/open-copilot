import { useState } from "react";
import { CustomChatEditButton } from "../style/common.style";
import { SquarePen } from "lucide-react";
import ChatEditModal from "../modal/ChatEditModal";
import { useDispatch } from "react-redux";
import { REQUEST_GET_APPLICATION } from "@/redux/home/homeAction";

const ChatEditButton = ({ setMessages }) => {
    const [editChat, setEditChat] = useState(false);
    const dispatch = useDispatch();
    const handleEditChatClick = () => {
        setEditChat(true);
    };

    return (
        <>
            <CustomChatEditButton className="plusIcon" onClick={handleEditChatClick}>
                <SquarePen size={20} />
            </CustomChatEditButton>
            <ChatEditModal
                open={editChat}
                handleClose={() => setEditChat(false)}
                setMessages={setMessages}
            />
        </>
    );
};

export default ChatEditButton;
