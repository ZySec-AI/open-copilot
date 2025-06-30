import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Navbar from "./component/appbar/Navbar";

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    let isAuth = localStorage.getItem("access_token");

    return isAuth && isAuth !== undefined ? (
        <>
            <Navbar />
            {children}
        </>
    ) : (
        <Navigate
            replace={true}
            to="/login"
            state={{ from: `${location.pathname}${location.search}` }}
        />
    );
};

export default PrivateRoute;
