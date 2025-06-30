import { all, fork } from "redux-saga/effects";
import authSaga from "./auth/authSagas";
import homeSaga from "./home/homeSagas";
import chatSaga from "./chat/chatSaga";

export default function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(homeSaga),
        fork(chatSaga)
    ]);
}
