import { takeLatest, call, put, all } from "redux-saga/effects";
import userServices from "../../services/user.services";
import {
    AUTH_ERROR,
    CREATE_USER_REQUEST,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOG_OUT,
    REQUEST_RESET_PASSWORD,
    RETRIEVE_DELETE_USER,
    RETRIEVE_USERS_SUCCESS,
    RETRIEVE_USER_REQUEST,
    RETRIEVE_USER_SUCCESS,
    SUCCESS,
    USER_LIST_REQUEST,
    VALID_TOKEN,
    RETRIEVE_EDIT_USER,
    CREATE_APIKEY_REQUEST,
    GET_API_KEY,
    GET_APIKEY_REQUEST,
    DELETE_API_KEY,
    GET_CONFIGS_DETAILS,
    UPDATE_CONFIGS_DETAILS,
    UPDATE_SYSTEM_CONTROLS,
    CREATE_CATEGORY_REQUEST
} from "./authAction";
import { toast } from "sonner";

function* validTokensaga(action) {
    try {
        const { data } = yield call(userServices.validatetoken, action.payload);
        yield put({ type: SUCCESS, payload: data });
    } catch (error) {
        yield put({ type: AUTH_ERROR, payload: error });
        window.location.replace("/login");
        localStorage.clear();
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* loginSaga(action) {
    try {
        const { data, status } = yield call(userServices.userLogin, action.payload);
        localStorage.setItem("access_token", data.access_token);
        window.location.replace("/");
        yield put({ type: LOGIN_SUCCESS, payload: status });
    } catch (error) {
        yield put({ type: AUTH_ERROR, payload: error });
        toast.error(error?.response?.data && error?.response?.data?.detail);
    }
}

function* retrieveUser() {
    try {
        const { data } = yield call(userServices.retrieveUser);
        yield put({ type: RETRIEVE_USER_SUCCESS, payload: data });
    } catch (error) {
        yield put({ type: AUTH_ERROR, payload: error });
        toast.error(error?.response?.data && error?.response?.data?.detail);
    }
}

function* retrieveUsers() {
    try {
        const { data } = yield call(userServices.retrieveUsers);
        yield put({ type: RETRIEVE_USERS_SUCCESS, payload: data });
    } catch (error) {
        yield put({ type: AUTH_ERROR, payload: error });
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* deleteUsers(action) {
    try {
        const { data } = yield call(userServices.deleteRetrieveuser, action.payload);
        yield call(retrieveUsers);
        toast.success("User deleted Successfully");
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* logoutUser(action) {
    try {
        const { data } = yield call(userServices.logOut, action.payload);
        localStorage.clear();
        window.location.replace("/login");
        toast.success(data && data.detail);
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* resetPasswordUser(action) {
    try {
        const { data } = yield call(userServices.resetPassword, action.payload);
        localStorage.clear();
        window.location.replace("/login");
        toast.success(data && data.detail);
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* editUser(action) {
    try {
        const { data } = yield call(userServices.editUser, action.payload, action.data);
        toast.success("User edited Successfully");
        yield call(retrieveUsers);
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* createUserSaga(action) {
    try {
        const { data } = yield call(userServices.createUser, action.payload);
        yield call(retrieveUsers);
        toast.success("User created Successfully");
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* createCategoriesSaga(action) {
    try {
        const {data, actions} = action.payload;
        console.log("data, actions",data, actions);
        const response = yield call(userServices.createCategory, data);
        if(response){
            console.log("actions", response, actions);
            actions?.()
        }
        console.log("response for cer", response);
        yield call(getTokenApi);
        toast.success("Category created Successfully");
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* getTokenApi() {
    try {
        const { data } = yield call(userServices.getApikey);

        yield put({ type: GET_API_KEY, payload: data });
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* createTokenApi() {
    try {
        const { data } = yield call(userServices.createApikey);
        yield call(getTokenApi);
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* deleteApikey(action) {
    try {
        const { data } = yield call(userServices.deleteApikey, action.payload);
        yield call(getTokenApi);
        toast.success("Apikey deleted Successfully");
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* getConfigApi() {
    try {
        const data = yield call(userServices.getConfigApi);
        if(data){
            yield put({ type: UPDATE_CONFIGS_DETAILS, payload: data.data });
        }
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* updateSystemControls(action) {
    try{
       const data = yield call(userServices.updateSystemControls,action.payload);
       if(data){
        yield put({ type: UPDATE_CONFIGS_DETAILS, payload: data.data });
       } 
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* authSaga() {
    yield all([
        takeLatest(VALID_TOKEN, validTokensaga),
        takeLatest(LOGIN_REQUEST, loginSaga),
        takeLatest(CREATE_USER_REQUEST, createUserSaga),
        takeLatest(RETRIEVE_USER_REQUEST, retrieveUser),
        takeLatest(USER_LIST_REQUEST, retrieveUsers),
        takeLatest(RETRIEVE_DELETE_USER, deleteUsers),
        takeLatest(LOG_OUT, logoutUser),
        takeLatest(REQUEST_RESET_PASSWORD, resetPasswordUser),
        takeLatest(RETRIEVE_EDIT_USER, editUser),
        takeLatest(CREATE_APIKEY_REQUEST, createTokenApi),
        takeLatest(GET_APIKEY_REQUEST, getTokenApi),
        takeLatest(DELETE_API_KEY, deleteApikey),
        takeLatest(GET_CONFIGS_DETAILS, getConfigApi),
        takeLatest(UPDATE_SYSTEM_CONTROLS, updateSystemControls),
        takeLatest(CREATE_CATEGORY_REQUEST, createCategoriesSaga)
    ]);
}

export default authSaga;
