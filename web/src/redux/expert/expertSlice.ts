import { apiSlice } from "@/redux/api";

export type Expert = {
    id: string,
    created_at: string,
    updated_at: string,
    expert_name: string,
    type: string,
    avatar: string,
    files: string[],
    category: string,
    created_by: {
        id: string,
        email: string,
        full_name: string
    },
    description: string,
    system_prompt: string,
    enable_history: boolean,
    internet_required: boolean,
    is_active: boolean
}

export type CreateExpert = {
    expert_name: string,
    expert_type: string,
    category: string,
    description: string,
    system_prompt: string,
    enable_history: boolean,
    internet_required: boolean,
    avatar: string,
}

export const expertSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getExperts: builder.query<Expert[], void>({
            query: () => '/experts',
            providesTags: (result, _error, arg) => {
                return result
                    ? [...result.map(({ id }) => ({ type: 'Expert' as const, id })), 'Expert']
                    : ['Expert'];
            }
        }),
        getExpert: builder.query<Expert, string>({
            query: (id) => `/experts/${id}`,
            providesTags: (result, _error, arg) => {
                return result
                    ? [{ type: "Expert", id: result.id }]
                    : ['Expert'];
            }
        }),
        createExpert: builder.mutation<Expert, FormData>({
            query: (data) => ({
                url: '/experts',
                method: "POST",
                body: data,
                formData: true
            }),
            invalidatesTags: ['Expert'],
        }),
        editExpert: builder.mutation<Expert, any>({
            query: (data) => {
               
                return {        
                    url: `/experts/${data?.id}`,
                    method: "PUT",
                    body: data?.formdata,
                };
            },
            invalidatesTags: ['Expert'],
        })

    })
})

export const {
    useGetExpertsQuery,
    useCreateExpertMutation,
    useEditExpertMutation,
    useGetExpertQuery,
} = expertSlice;
