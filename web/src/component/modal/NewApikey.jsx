import React from "react";
import { Modal, Box, Typography, TextField, styled, Divider, Button } from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";

const Label = styled("label")({
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 500,
    margin: "1rem"
});
const NewApikey = ({ open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle sx={{ borderRadius: "12px" }}>
                <Label htmlFor="username"> New API Key</Label>
                <Divider />
                <Box sx={{ padding: "1.4rem", gap: "2rem" }}>
                    <Typography htmlFor="username">Key Label</Typography>
                    <TextField
                        type="text"
                        id="username"
                        name="username"
                        size="small"
                        placeholder="Untitiled API Key (2022-47-20 13:17:23)"
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
                        <Customeuploadbutton>Create API Key</Customeuploadbutton>
                    </Box>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default NewApikey;
