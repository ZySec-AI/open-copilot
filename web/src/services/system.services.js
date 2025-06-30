import { API_URL } from "@/constant/config";
import axios from "axios";

const getAppstore = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(API_URL + "/applications", { headers });
    return response.data;
};

export default {
    getAppstore
};
