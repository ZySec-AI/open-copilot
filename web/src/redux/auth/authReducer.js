import {
    AUTH_ERROR,
    GET_API_KEY,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    RETRIEVE_USERS_SUCCESS,
    RETRIEVE_USER_SUCCESS,
    SUCCESS,
    SUCCESS_MESSAGE,
    UPDATE_CONFIGS_DETAILS
} from "./authAction";
import { useSelector } from "react-redux";

const initialstate = {
    isValid: null,
    loginSuccess: null,
    error: null,
    message: null,
    retrieveUser: {},
    retrieveUsers: [],
    apiKeys: [],
    configDetails:null
};

const authReducer = (state = initialstate, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                error: action.payload.message // Store only the error message
            };
        case SUCCESS:
            return {
                ...state,
                isValid: action.payload
            };
        case AUTH_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case LOGIN_SUCCESS:
            return { ...state, loginSuccess: action.payload };
        case RETRIEVE_USER_SUCCESS:
            return {
                ...state,
                retrieveUser: action.payload
            };
        case RETRIEVE_USERS_SUCCESS:
            return {
                ...state,
                retrieveUsers: action.payload
            };
        case SUCCESS_MESSAGE:
            return {
                ...state,
                message: action.payload,
                error: null
            };
        case GET_API_KEY:
            return {
                ...state,
                apiKeys: action.payload
            };
        case UPDATE_CONFIGS_DETAILS:
            return {
                ...state,
                configDetails: action.payload
            }
        default:
            return state;
    }
};
export default authReducer;

export function useAuthMaster() {
    return useSelector((state) => state.auth);
}
