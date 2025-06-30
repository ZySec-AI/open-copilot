import chatServices from "@/services/chat.services";
import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import {
    CHATID_DATA,
    CHAT_HISTORY,
    HIDE_TYPING_INDICATOR,
    PROMPT_CHAT_REQUEST,
    PROMPT_CHAT_SUCCESS,
    REQUEST_CHATID_DATA,
    REQUEST_CHAT_HISTORY,
    REQUEST_DELETE_HISTORY,
    REQUEST_GROUPCHAT,
    SHOW_TYPING_INDICATOR,
    LOADING,
    REQUEST_REMOVEEXPERT
} from "./chatAction";
import { toast } from "sonner";

function* promptChat(action) {
    try {
        yield put({ type: SHOW_TYPING_INDICATOR });
        const { data } = yield call(chatServices.promptChat, action.payload.payloadData);
        const botResponses = {};
        const newData = data.response.map((responseItem) => {
            const splitId = responseItem.id.split("_");
            const responseId = splitId[1];
            const choiceContent = responseItem.choices.map((choice) => choice.message.content);
            return (botResponses[responseId] = choiceContent);
        });
        yield delay(1000);
        yield put({
            type: PROMPT_CHAT_SUCCESS,
            payload: {
                bot: botResponses,
                message: action.payload.message,
                chat_id: data.chat_id
            }
        });
        yield put({ type: NEW_CHAT_IDS , payload : {id : action.payload.payloadData.expert_id, addId : false} });
        yield put({ type: HIDE_TYPING_INDICATOR });
    } catch (error) {
        yield put({ type: HIDE_TYPING_INDICATOR });
        if (error&& error?.response&& error.response?.data && error.response.data?.detail){
        toast.error(error.response.data && error.response.data.detail);
    }
    }
}

function* chatHistory(action) {
    try {
        let { data } = yield call(chatServices.getchatHistory, action.payload);
        data.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        yield put({ type: CHAT_HISTORY, payload: data });
        yield put({type : LOADING, payload : false})
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
        yield put({type : LOADING, payload : false})
    }
}
function* deleteHistory(action) {
    try {
        const { status } = yield call(chatServices.deleteHistory, action.payload);
        if (status === 204) {
            toast.success("Chat history deleted successfully");
        }
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* chatIdData(action) {
    try {
        const { data } = yield call(chatServices.getChatidbydata, action.payload);
        yield put({ type: CHATID_DATA, payload: data, id: action.payload });
    } catch (error) {
        console.log(error);
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* groupChat(action) {
    try {
        const { data } = yield call(chatServices.groupChat, action.appid, action.chatid);
        yield put({ type: CHATID_DATA, payload: data });
        toast.error("Added group chat expert");
    } catch (error) {

        toast.error("Expert already in chat.");
    }
}
function* removeExpert(action) {
    try {
        const response = yield call(chatServices.removeExpert, action.payload.expert_id, action.payload.chat_id);
        if (response.status === 204) {
            toast.success('Expert removed successfully');
        } else {
            throw new Error('Failed to remove expert');
        }
    } catch (error) {
        toast.error('Error removing expert: ' + error.message);
    }
}
function* chatSaga() {
    yield all([
        takeLatest(PROMPT_CHAT_REQUEST, promptChat),
        takeLatest(REQUEST_CHAT_HISTORY, chatHistory),
        takeLatest(REQUEST_DELETE_HISTORY, deleteHistory),
        takeLatest(REQUEST_CHATID_DATA, chatIdData),
        takeLatest(REQUEST_GROUPCHAT, groupChat),
        takeLatest(REQUEST_REMOVEEXPERT, removeExpert)
    ]);
}
export default chatSaga;
