import React from "react";
import { Modal, Box, Typography, TextField, styled, Divider, Button } from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";
const Label = styled("label")({
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 500,
    margin: "1rem"
});

const PersonalInfo = ({ open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle>
                <Label>Personal Info</Label>
                <Divider />
                <Box sx={{ padding: "1.4rem 2rem" }}>
                    <Typography>Full Name</Typography>
                    <TextField
                        id="outlined-disabled"
                        placeholder="Full Name"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                    <Typography sx={{ paddingTop: "1rem" }}>Email Address</Typography>
                    <TextField
                        id="outlined-disabled"
                        placeholder="Email Address"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                    <Typography sx={{ paddingTop: "1rem" }}>Api Key</Typography>
                    <TextField
                        id="outlined-disabled"
                        placeholder="Api Key"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            paddingTop: "1rem",
                            gap: "1rem"
                        }}
                    >
                        <Button onClick={handleClose}>Cancel</Button>
                        <Customeuploadbutton>Save</Customeuploadbutton>
                    </Box>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default PersonalInfo;
