import React from "react";
import { Modal, Box, Button, styled, TextField } from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";

const Label = styled("label")({
    display: "block",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: 500
});

const ReName = ({ open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle sx={{ borderRadius: "12px" }}>
                <Box sx={{ padding: "1.4rem" }}>
                    <Label htmlFor="username">Rename</Label>
                    <TextField
                        type="text"
                        id="username"
                        name="username"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        padding: "1rem",
                        gap: 2
                    }}
                >
                    <Button onClick={handleClose}>Cancel</Button>
                    <Customeuploadbutton>Create</Customeuploadbutton>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default ReName;
