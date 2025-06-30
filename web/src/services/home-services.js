import { API_URL } from "@/constant/config";
import axios from "axios";

const getApplications = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(API_URL + "/experts", {
        headers
    });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};
const deleteApplications = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.delete(API_URL + "/experts/" + id, { headers });
    if (response && response.status) {
        return id;
    }
};

const getTags = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(API_URL + "/tags", {
        headers
    });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};


export default {
    getApplications,
    getTags,
    deleteApplications,
};
