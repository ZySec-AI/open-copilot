import { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    styled,
    Divider,
    Button,
    MenuItem
} from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";
import { useDispatch } from "react-redux";
import { CREATE_USER_REQUEST } from "@/redux/auth/authAction";
const Label = styled("label")({
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 500,
    margin: "1rem"
});

const CreateUser = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const [userData, setuserData] = useState({});

    const handleChange = (event) => {
        if (event.target.name === "roles") {
            const rolesArray = event.target.value.split(",");
            setuserData({
                ...userData,
                roles: rolesArray
            });
        } else {
            setuserData({
                ...userData,
                [event.target.name]: event.target.value
            });
        }
    };

    const createUsersubmit = async () => {
        try {
            await dispatch({ type: CREATE_USER_REQUEST, payload: userData });
            handleClose();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Modal  open={open} onClose={handleClose}>
            <Modalstyle>
                <Label htmlFor="username">Create User</Label>
                <Divider />
                <Box sx={{ padding: "1.4rem 2rem" }}>
                    <Typography htmlFor="Full Name">Full Name</Typography>
                    <TextField
                        placeholder="Full Name"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                        onChange={handleChange}
                        name="full_name"
                    />
                    <Typography htmlFor="Email Address" sx={{ gap: 2, paddingTop: "1rem" }}>
                        Email Address
                    </Typography>
                    <TextField
                        placeholder="Email Address"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                        onChange={handleChange}
                        name="email"
                    />
                    <Typography htmlFor="Password" sx={{ gap: 2, paddingTop: "1rem" }}>
                        Password
                    </Typography>
                    <TextField
                        type="Password"
                        placeholder="*******"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                        onChange={handleChange}
                        name="password"
                    />
                    <Typography htmlFor="role" sx={{ gap: 2, paddingTop: "1rem" }}>
                        Role
                    </Typography>
                    <TextField
                        select
                        id="role"
                        name="roles"
                        size="small"
                        onChange={handleChange}
                        defaultValue="Admin"
                        sx={{
                            width: "22rem",
                            border: "1px solid black",
                            borderRadius: "8px"
                        }}>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </TextField>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            paddingTop: "1rem",
                            gap: "1rem"
                        }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Customeuploadbutton onClick={createUsersubmit}>Save</Customeuploadbutton>
                    </Box>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default CreateUser;
