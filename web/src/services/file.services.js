import { API_URL } from "@/constant/config";
import axios from "axios";

// Function to create a folder
const createFolder = async (data) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.post(`${API_URL}/folders/`, data, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to get all folders
const getFolders = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(`${API_URL}/folders/`, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to get subfolders by folder ID

// Function to get categories
const getCategory = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(`${API_URL}/categories/`, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to upload a file
const uploadFile = async (data) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.post(`${API_URL}/files/upload`, data, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to get files by folder ID
const getFilesByFolder = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(`${API_URL}/files/?folder_id=${id}`, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to get all files
const getAllFiles = async () => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(`${API_URL}/files/`, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to download a file by ID
const downloadFile = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.get(`${API_URL}/files/${id}`, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to delete a file by ID
const deleteFile = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.delete(`${API_URL}/files/${id}`, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

// Function to delete a folder by ID
const deleteFolder = async (id) => {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    };
    const response = await axios.delete(`${API_URL}/folders/${id}`, { headers });
    if (response.data) {
        return { data: response.data, status: response.status };
    }
};

export default {
    createFolder,
    getFolders,
    getCategory,
    uploadFile,
    getFilesByFolder,
    getAllFiles,
    downloadFile,
    deleteFile,
    deleteFolder
};