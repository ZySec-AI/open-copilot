import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField, Container, Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { LoginButton } from "../style/common.style";
import login from "../../images/login.png";
import { useDispatch } from "react-redux";
import { LOGIN_REQUEST } from "@/redux/auth/authAction";

import { useLocation, useNavigate } from "react-router-dom";

const Colors = tokens();

const StyledLabel = styled("label")({
    display: "block",
    margin: "0.7rem",
    fontSize: "1.1rem",
    fontWeight: 500,
    color: Colors.black_color[100]
});

const StyledContainer = styled(Container)({
    marginLeft: "15rem",
    color: Colors.white_color[100],
    borderRadius: "1rem",
    border: "2px solid #ccc",
    padding: "2rem",
    position: "fixed",
    overflow: "hidden",
    backgroundColor: Colors.white_color[100]
});

const Login = () => {
    const dispatch = useDispatch();
    const [loginData, setLoginData] = useState({});
    const navigate = useNavigate();
    const isAuth = localStorage.getItem("access_token");
    useEffect(() => {
        if (isAuth && isAuth !== "undefined") {
            navigate("/");
        }
    }, [isAuth]);
    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value
        });
    };
    const SubmitLogin = async () => {
        try {
            await dispatch({ type: LOGIN_REQUEST, payload: loginData });
        } catch (error) {
            throw error;
        }
    };

    return (
        <Box
            sx={{
                height: "92vh",
                display: "flex",
                width: "100vw",
                alignItems: "center",
                position: "relative",
                overflow: "hidden", // Ensures the pseudo element doesn't extend outside
                "&::before": {
                    content: "'\"\"'",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    backgroundImage: `url(${login})`,
                    backgroundSize: "cover",
                    opacity: 0.3 // 50% opacity
                }
            }}
            className="loginMainWrap">
            <StyledContainer maxWidth="xs" className="loginWrapper">
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ color: Colors.black_color[200], marginBottom: "3rem" }}>
                    Login
                </Typography>
                <StyledLabel htmlFor="email">Email</StyledLabel>
                <TextField
                    id="email"
                    type="email"
                    name="email"
                    variant="outlined"
                    placeholder="jon@example.com"
                    fullWidth
                    size="small"
                    onChange={handleChange}
                />
                <StyledLabel htmlFor="password">Password</StyledLabel>
                <TextField
                    id="password"
                    placeholder="user@example.com"
                    type="password"
                    name="password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={handleChange}
                />
                <LoginButton onClick={SubmitLogin}>Login</LoginButton>
            </StyledContainer>
        </Box>
    );
};

export default Login;
