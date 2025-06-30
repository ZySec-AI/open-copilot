import React, { useState } from "react";
import { Modal, Box, styled, TextField, Button, Divider, Typography } from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";
import { useDispatch } from "react-redux";
import { REQUEST_RESET_PASSWORD } from "@/redux/auth/authAction";

const Label = styled("label")({
    display: "block",
    fontSize: "1.2rem",
    margin: "1rem",
    fontWeight: 500
});

const ChangePasswordModal = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError("");
    };

    const handleSave = () => {
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            setConfirmPassword("");
        } else {
            dispatch({
                type: REQUEST_RESET_PASSWORD,
                payload: {
                    old_password: currentPassword,
                    new_password: newPassword
                }
            });
            handleClose();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };
    

    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle sx={{ borderRadius: "12px" }}>
                <Label>Change Password</Label>
                <Divider />
                <Box sx={{ padding: "0 1.4rem" }}>
                    <Typography sx={{ paddingTop: "1rem" }}>Current Password</Typography>
                    <TextField
                        placeholder="*******"
                        type="password"
                        id="current_password"
                        name="current_password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                    <Typography sx={{ paddingTop: "1rem" }}>New Password</Typography>
                    <TextField
                        placeholder="*******"
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                    <Typography sx={{ paddingTop: "1rem" }}>Confirm Password</Typography>
                    <TextField
                        placeholder="*******"
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={confirmPasswordError !== ""}
                        helperText={confirmPasswordError}
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        justifyContent: "end",
                        alignItems: "center",
                        display: "flex",
                        margin: "1rem",
                        gap: 1
                    }}
                >
                    <Button onClick={handleClose}>Cancel</Button>
                    <Customeuploadbutton onClick={handleSave}>Save</Customeuploadbutton>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default ChangePasswordModal;
