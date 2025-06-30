import { API_URL } from "@/constant/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
    }),
    tagTypes: ['File', 'Folder', "Category", 'Expert'],
    endpoints: () => ({}),
})
