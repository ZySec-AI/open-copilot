import { apiSlice } from "@/redux/api";

export type Folder = {
    id: string,
    created_at: string,
    updated_at: string,
    name: string,
    created_by: {
        id: string,
        name: string,
        full_name: string,
    },
    children: Folder[],
    description: string,
}

export type Category = {
    id: string;
    name: string;
    description: string;
    map:any;
}

export type CreateFolder = {
    name: string;
    description: string;
    parent_folder: string;
}

export const folderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFolders: builder.query<Folder[], void>({
            query: () => '/folders/',
            providesTags: (result, error, arg) => {
                return result
                    ? [...result.map(({ id }) => ({ type: 'Folder' as const, id })), 'Folder']
                    : ['Folder'];
            }
        }),
        getCategories: builder.query<Category[], void>({
            query: () => "/categories/?limit=15",
            providesTags: (result, error, arg) => {
                return result
                    ? [...result.map(({ id }) => ({ type: 'Category' as const, id })), 'Category']
                    : ['Category'];
            }
        }),
        createFolder: builder.mutation<Folder, CreateFolder>({
            query: (data) => ({
                url: "/folders/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Folder'],
        }),
        deleteFolder: builder.mutation<void, string>({
            query: (id) => ({
                url: `/folders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Folder'],
        })
    })
});

export const {
    useGetFoldersQuery,
    useCreateFolderMutation,
    useGetCategoriesQuery,
    useDeleteFolderMutation,
} = folderApiSlice;