import homeServices from "@/services/home-services";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { toast } from "sonner";
import {
    DELETE_APPLICATION,
    GET_APPLICATION,
    GET_TAGS,
    REQUEST_GET_APPLICATION,
    REQUEST_GET_TAGS,
    SEARCH_FAILURE,
    SEARCH_REQUEST,
    SEARCH_SUCCESS
} from "./homeAction";

function* getApplicationsagas() {
    try {
        const { data } = yield call(homeServices.getApplications);
        yield put({ type: GET_APPLICATION, payload: data });
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* getTagssagas() {
    try {
        const { data } = yield call(homeServices.getTags);
        yield put({ type: GET_TAGS, payload: data });
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}
function* deleteApplications(action) {
    try {
        const { status } = yield call(homeServices.deleteApplications, action.payload);
        if (status === 204) {
            toast.success("Chat history deleted successfully");
        }
    } catch (error) {
        toast.error(error.response.data && error.response.data.detail);
    }
}

function* handleSearchRequest(action) {
    try {
        const applications = yield select((state) => state.home);
        const searchData = applications.applications.filter((item) =>
            item.expert_name.toLowerCase().includes(action.payload.toLowerCase())
        );
        yield put({ type: SEARCH_SUCCESS, payload: searchData });
    } catch (error) {
        yield put({ type: SEARCH_FAILURE, payload: error.message });
    }
}

function* homeSaga() {
    yield all([
        takeLatest(REQUEST_GET_APPLICATION, getApplicationsagas),
        takeLatest(SEARCH_REQUEST, handleSearchRequest),
        takeLatest(REQUEST_GET_TAGS, getTagssagas),
        takeLatest(DELETE_APPLICATION, deleteApplications)
    ]);
}

export default homeSaga;
