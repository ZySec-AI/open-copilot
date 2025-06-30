import { API_URL } from "@/constant/config";
import axios from "axios";

const promptChat = async (data) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.post(API_URL + "/prompt_chat", data, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

const getchatHistory = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(API_URL + "/chats?expert_id=" + id, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

const getChatidbydata = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(API_URL + "/messages/?chat_id=" + id, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};
const deleteHistory = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.delete(API_URL + "/chats/" + id, { headers });
    if (response) {
        return { data: response.data, status: response.status };
    }
};
const groupChat = async (appid, chatid) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.put(
        API_URL + "/chats/" + chatid + "/add_expert?expert_id=" + appid,
        {},
        {
            headers
        }
    );
    if (response) {
        return { data: response.data, status: response.status };
    }
};
const removeExpert = async (expert_id, chat_id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.put(
        API_URL + "/chats/" + chat_id + "/remove_expert?expert_id=" + expert_id,
        {},
        {
            headers
        }
    );
    if (response) {
        return { data: response.data, status: response.status };
    }
};
export default {
    promptChat,
    getchatHistory,
    deleteHistory,
    getChatidbydata,
    groupChat,
    removeExpert
};
