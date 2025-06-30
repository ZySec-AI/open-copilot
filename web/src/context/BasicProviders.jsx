import { useChatMaster } from "@/redux/chat/chatReducer";
import { createContext, useContext, useState } from "react";

export const BasicContext = createContext();
export const useUIContext = () => useContext(BasicContext);

const Basicprovider = ({ children }) => {
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [folderId, setFolderId] = useState("");
    const [selectedUser, setSelectedUser] = useState({});
    const [expertUser, setExpertUser] = useState({});
    const [shouldReload, setShouldReload] = useState(false);
    const { chatId } = useChatMaster();
    const [chatIds, setChatIds] = useState(chatId);
    const hndleSelecteuser = (item) => {
        setSelectedUser(item);
    };
    return (
        <BasicContext.Provider
            value={{
                isAuthenticated,
                setisAuthenticated,
                folderId,
                setFolderId,
                selectedUser,
                setSelectedUser,
                shouldReload,
                setShouldReload,
                hndleSelecteuser,
                chatIds,
                setChatIds,
                expertUser,
                setExpertUser,
            }}>
            {children}
        </BasicContext.Provider>
    );
};

export default Basicprovider;
