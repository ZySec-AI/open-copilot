import { REQUEST_CHATID_DATA, REQUEST_DELETE_HISTORY } from "@/redux/chat/chatAction";
import { useDispatch } from "react-redux";
import { useUIContext } from "@/context/BasicProviders";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { toast } from "sonner";

interface ChatHistoryItemProps {
    child: string;
    id?: string;
    onPress?: (id: string) => void;
    data?: any;
    isSelected?: boolean;
}

const ChatHistoryList: React.FC<ChatHistoryItemProps> = ({ child, data, onPress, isSelected }) => {
    const dispatch = useDispatch();
    const { setShouldReload, setChatIds } = useUIContext();

    const handleChatdata = (id: string) => {
        dispatch({ type: REQUEST_CHATID_DATA, payload: id });
        if (onPress) onPress(id);
    };

    const handleDelete = async (id: string) => {
        try {
            dispatch({ type: REQUEST_DELETE_HISTORY, payload: id });
            setShouldReload((pre: any) => !pre);
        } catch (error) {
            throw error;
        }
    };

    function getLastEditedText(updatedAt: any) {
        const currentTime: any = new Date();
        const updatedTime: any = new Date(updatedAt);
        const timeDifferenceInMilliseconds = currentTime - updatedTime;
        const timeDifferenceInSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
        const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
        const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

        let lastUpdatedText;
        if (timeDifferenceInSeconds < 60) {
            lastUpdatedText = "a few seconds ago";
        } else if (timeDifferenceInMinutes < 60) {
            lastUpdatedText = `${timeDifferenceInMinutes} minutes ago`;
        } else if (timeDifferenceInHours < 24) {
            lastUpdatedText = `${timeDifferenceInHours} hours ago`;
        } else if (timeDifferenceInDays < 2) {
            lastUpdatedText = "a day ago";
        } else if (timeDifferenceInDays <= 10) {
            lastUpdatedText = `${timeDifferenceInDays} days ago`;
        } else {
            const options = { year: "numeric", month: "short", day: "numeric" };
            lastUpdatedText = `${updatedTime.toLocaleDateString(undefined, options)}`;
        }
        return lastUpdatedText;
    }

    return (
        <div
            onClick={() => handleChatdata(data?.id)}
            className="group hover:scale-110 duration-200 hover:cursor-pointer"
        >
            <div
                className={`mt-4 m-2 flex flex-row border border-gray-200 rounded-lg p-2 ${isSelected ? 'bg-blue-100' : 'hover:bg-blue-100'} box-shadow`}
            >
                <div className="whitespace-nowrap overflow-hidden">
                    {child}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisIcon
                            className="h-4 w-4 invisible duration-100 group-hover:visible ml-auto"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            toast.promise(handleDelete(data?.id), {
                                loading: "Deleting Chat...",
                                success: () => {
                                    return "Chat deleted!"
                                },
                                error: () => {
                                    return "Error in deleting chat...";
                                },
                            });
                        }}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default ChatHistoryList;
