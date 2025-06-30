import { useSelector } from "react-redux";
import { GET_APPLICATION, GET_TAGS, SEARCH_FAILURE, SEARCH_SUCCESS } from "./homeAction";

const initialState = {
    applications: [],
    tags:[],
    searchData: [],
    error: null
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_APPLICATION:
            return {
                ...state,
                applications: action.payload,
                error: null,
            };
            case GET_TAGS:
                return {
                    ...state,
                    tags: action.payload,
                    error: null,
                };
        case SEARCH_SUCCESS:
            return {
                ...state,
                searchData: action.payload,
                error: null
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                searchData: null,
                error: action.payload
            };
        default:
            return state;
    }
};

export default homeReducer;
export const useHomeMaster = () => {
    return useSelector((state) => state.home);
};
