import React from "react";
import { Modal, Box, Typography, TextField, styled, Divider, Button } from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";

const Label = styled("label")({
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 500,
    margin: "1rem"
});

const AppidEdit = ({ open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle>
                <Label htmlFor="username">App ID & Secret</Label>
                <Divider />
                <Box sx={{ padding: "1.4rem" }}>
                    <Typography htmlFor="username">Enter App ID</Typography>
                    <TextField
                        id="outlined-disabled"
                        defaultValue="Untitiled API Key (2022-47-20 13:17:23)"
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

export default AppidEdit;
