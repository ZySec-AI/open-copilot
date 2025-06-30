import axios from "axios";
import { API_URL } from "../constant/config";

//token validate
const validatetoken = async (data) => {
    const response = await axios.post(API_URL + "/auth/validate_token", data);
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};
//Login api
const userLogin = async (data) => {
    const response = await axios.post(API_URL + "/auth/login", data);
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

//Retrieve user api
const retrieveUser = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };

    const response = await axios.get(API_URL + "/users/me", { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

//Retrieve users api
const retrieveUsers = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };

    const response = await axios.get(API_URL + "/users/", { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

//create user for admin
const createUser = async (data) => {
    const response = await axios.post(API_URL + "/users/", data);
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};
//Create category
const createCategory = async (data) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.post(API_URL + "/categories/", data, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

//delete login user
const deletsuser = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.delete(API_URL + "/users/me", { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

//delete retrieveUser
const deleteRetrieveuser = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.delete(API_URL + "/users/" + id, { headers });
    if (response && response.status) {
        return { data: response.data, status: response.status };
    }
};

//log out user
const logOut = async (data) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.post(API_URL + "/auth/logout", data, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};
// edit user
const editUser = async (id, data) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.put(API_URL + "/users/" + id, data, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

const resetPassword = async (data) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
    };
    const response = await axios.post(API_URL + "/users/me/reset_password", data, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

const createApikey = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.post(API_URL + "/create_api_token", {}, { headers });
    if (response) {
        return { data: response.data, status: response.status };
    }
};

const getApikey = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(API_URL + "/get_api_tokens", { headers });

    if (response) {
        return { data: response.data, status: response.status };
    }
};

const deleteApikey = async (item) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.delete(API_URL + "/delete_api_token?api_key=" + item, { headers });
    if (response && response.status) {
        return { data: response.data, status: response.status };
    }
};

const getConfigApi = async() =>{
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(API_URL + "/configs", { headers });
    if (response?.data && response.status == 200) {
        return { data: response.data, status: response.status };
    }
}

const updateSystemControls = async(data) =>{
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.post(API_URL + "/configs",data, {headers});
  
    if (response?.data && response.status == 200) {
        return { data: response.data, status: response.status };
    }
}
export default {
    userLogin,
    retrieveUser,
    validatetoken,
    retrieveUsers,
    createUser,
    deletsuser,
    deleteRetrieveuser,
    logOut,
    resetPassword,
    editUser,
    createApikey,
    getApikey,
    deleteApikey,
    getConfigApi,
    updateSystemControls,
    createCategory
};
