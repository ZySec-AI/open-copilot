import { useSelector } from "react-redux";
import {
    CHATID_DATA,
    CHAT_HISTORY,
    HIDE_TYPING_INDICATOR,
    NEW_CHAT,
    PROMPT_CHAT_SUCCESS,
    SHOW_TYPING_INDICATOR,
    LOADING,
    NEW_CHAT_IDS
} from "./chatAction";

const initialstate = {
    chatSuccess: [],
    chathistory: [],
    chatId: "",
    typingIndicator: false,
    chatLoading: true,
    newChatIds: [],
 
};

const chatReducer = (state = initialstate, action) => {
    switch (action.type) {
        case PROMPT_CHAT_SUCCESS:
            return {
                ...state,
                chatSuccess: [...state.chatSuccess, action.payload],
                chatId: action.payload.chat_id
            };
        case CHAT_HISTORY:
            return {
                ...state,
                chathistory: action.payload
            };
        case CHATID_DATA:
            if (!Array.isArray(action.payload)) {
                return state;
            }
            const sortedPayload = [...action.payload].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            const newData = sortedPayload.map((item) => {
                const botResponses = {};
                item.response.forEach((responseItem) => {
                    const splitId = responseItem.id.split("_");
                    const responseId = splitId[1];
                    const choiceContent = responseItem.choices.map(
                        (choice) => choice.message.content
                    );

                    botResponses[responseId] = choiceContent;
                });
                return {
                    message: item.user_prompt,
                    bot: botResponses,
                };
            });
            return {
                ...state,
                chatSuccess: newData,
                chatId: action.id,
            };
        case LOADING:
            return {
                ...state,
                chatLoading: action.payload
            };
        case NEW_CHAT:
            return {
                ...state,
                chatSuccess: [],
                chatId: "",
                expertIds: [] 
            };
        case SHOW_TYPING_INDICATOR:
            return {
                ...state,
                typingIndicator: true
            };
        case HIDE_TYPING_INDICATOR:
            return {
                ...state,
                typingIndicator: false
            };
        case NEW_CHAT_IDS: {
            let newIds = [...state.newChatIds];
            if (action.payload.addId) {
                newIds.push(action.payload.id);
            } else {
                newIds = newIds.filter(item => item !== action.payload.id);
            }
            return {
                ...state,
                newChatIds: newIds
            }
        }
        default:
            return state;
    }
};

export default chatReducer;

export function useChatMaster() {
    return useSelector((state) => state.chat);
}
