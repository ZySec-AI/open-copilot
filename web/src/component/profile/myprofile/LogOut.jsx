import { Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { LOG_OUT } from "@/redux/auth/authAction";

const LogOut = () => {
    const Colors = tokens();
    const dispatch = useDispatch();
    const handlelogout = () => {
        dispatch({
            type: LOG_OUT,
            payload: { token: localStorage.getItem("access_token"), token_type: "bearer" }
        });
    };
    return (
        <>
            <Typography
                variant="h6"
                sx={{
                    padding: "1rem 2rem",
                    color: Colors.error[100],
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                    cursor: "pointer"
                }}
                onClick={handlelogout}>
                <AiOutlineLogout /> Log out
            </Typography>
        </>
    );
};

export default LogOut;
