import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/component/ui/sonner";
import "./App.css";
import Login from "./component/account/Login";
import Profileindex from "./component/profile";
import Apikeys from "./component/profile/myprofile/Apikeys";
import Docdashboard from "./component/documents/DocDashboard";
import Home from "./component/home/Home";
import Contentindex from "./component/content";
import { ChatPage } from "@/component/chat/chat-page";
import CreateContent from "./component/content/CreateContent";
import MyProfile from "./component/profile/myprofile/Myprofile";
import { Settings } from "@/component/settings";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { VALID_TOKEN } from "./redux/auth/authAction";
import PrivateRoute from "./PrivateRoute";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            dispatch({
                type: VALID_TOKEN,
                payload: { token: localStorage.getItem("access_token"), token_type: "bearer" }
            });
        }
    }, [dispatch]);
    return (
        <div className="flex flex-col h-screen">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/Content-index"
                    element={
                        <PrivateRoute>
                            <Contentindex />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/News-index"
                    element={
                        <PrivateRoute>
                            <Contentindex />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/Create-Content/:id"
                    element={
                        <PrivateRoute>
                            <CreateContent />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/myprofile"
                    element={
                        <PrivateRoute>
                            <MyProfile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/api-keys"
                    element={
                        <PrivateRoute>
                            <Profileindex title={Apikeys} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/ai-chat"
                    element={
                        <PrivateRoute>
                            <ChatPage />
                        </PrivateRoute>
                    }
                />
                <Route exact
                    path="/files/:folderId?"
                    element={
                        <PrivateRoute>
                            <Docdashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings/:route"
                    element={
                        <PrivateRoute>
                            <Settings />
                        </PrivateRoute>
                    }
                />
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
