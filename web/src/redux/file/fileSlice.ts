import { API_URL } from "@/constant/config";
import { apiSlice } from "@/redux/api";

export type IFile = {
    id: string,
    name: string,
    description: string,
    uploaded_first_time: string,
    uploaded_by: {
        id: string,
        email: string,
        full_name: string
    },
    sha256_hash: string,
    deleted: boolean,
    file_size: number,
    file_ext: string,
    path: string,
    folder: {
        id: string,
        created_at: string,
        updated_at: string,
        name: string,
        created_by: {
            id: string,
            name: string,
            email: string,
        },
        children: [],
        description: string,
    },
    tags: string[],
    embedded_status: {
        model: string,
        dim: number,
        status: boolean,
        indexed_time: string,
    }[],

    categories: {
        id: string,
        name: string,
        description: string
    }[]
};

export interface CreateFile {
    description: string | undefined;
    categories: string[] | undefined,
    tags: string[] | undefined,
    folder_id: string | undefined,
    file: File,
}

export interface uploadId {
    file_id: string
}

export const fileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFile: builder.query<IFile[], string | undefined>({
            query: (id) => id ? `/files/?folder_id=${id}` : `/files/`,
            transformResponse: (response, meta, arg) => {
                if (Array.isArray(response)) {
                    return response.map((x) => {
                        x['name'] = x['filename'];
                        delete x['filename'];
                        return x;
                    });
                }
                return [];
            },
            providesTags: (result, _error, arg) => {
                return result
                    ? [...result.map(({ id }) => ({ type: 'File' as const, id })), 'File']
                    : ['File'];
            }
        }),
        uploadFile: builder.mutation<void, FormData>({
            query: (data) => ({
                url: "/files/upload",
                method: "POST",
                body: data,
                formData: true,
            }),
            invalidatesTags: ['File'],
        }),
        uploadFileId: builder.mutation<void, uploadId>({
            query: (file_id) => ({
                url: `/files/${file_id}/expert`,
                method: "POST",
                mode: 'no-cors',
                headers: {
                    "Origin": API_URL,
                },
            }),
            invalidatesTags: ['File'],
        }),
        deleteFile: builder.mutation<void, string>({
            query: (id) => ({
                url: `/files/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['File'],
        }),
        downloadFile: builder.query<string, any>({
            query: (id) => `/files/${id}`,
        })
    })
});


export const {
    useUploadFileIdMutation,
    useDownloadFileQuery,
    useGetFileQuery,
    useDeleteFileMutation,
    useUploadFileMutation,
} = fileApiSlice
