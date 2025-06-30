import { useState } from "react";
import { Modal, Box, Typography, TextField, styled, Divider, Button } from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";
import { RETRIEVE_EDIT_USER } from "@/redux/auth/authAction";
import { useDispatch } from "react-redux";
const Label = styled("label")({
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 500,
    margin: "1rem"
});
const EditUserModal = ({ open, handleClose, userid, edituserdata, setEdituserdata }) => {
    const dispatch = useDispatch();
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEdituserdata((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleEditUser = async () => {
        try {
            await dispatch({ type: RETRIEVE_EDIT_USER, payload: userid, data: edituserdata });
            handleClose();
        } catch (error) {
            throw error;
        }
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle>
                <Label htmlFor="username">Edit User</Label>
                <Divider />
                <Box sx={{ padding: "1.4rem 2rem" }}>
                    <Typography htmlFor="Email " sx={{ gap: 2, paddingTop: "1rem" }}>
                        Email
                    </Typography>
                    <TextField
                        placeholder="Email"
                        value={edituserdata.email}
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                        name="email"
                        onChange={handleChange}
                    />
                    <Typography htmlFor=" Name"> Name</Typography>
                    <TextField
                        placeholder=" Name"
                        size="small"
                        value={edituserdata.full_name}
                        sx={{
                            width: "22rem"
                        }}
                        name="full_name"
                        onChange={handleChange}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            paddingTop: "1rem",
                            gap: "1rem"
                        }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Customeuploadbutton onClick={handleEditUser}>Save</Customeuploadbutton>
                    </Box>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default EditUserModal;
