import React from "react";
import { Modal, Box, Typography, TextField, styled, Divider, Button } from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";

const Label = styled("label")({
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 500,
    margin: "1rem"
});

const AddCategorise = ({ open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle>
                <Label htmlFor="username">AddCategorise</Label>
                <Divider />
                <Box sx={{ padding: "1.4rem 2rem" }}>
                    <Typography htmlFor="username">Name</Typography>
                    <TextField
                        id="outlined-disabled"
                        size="small"
                        sx={{
                            width: "22rem"
                        }}
                    />
                    <Typography htmlFor="Description" sx={{ gap: 2, paddingTop: "1rem" }}>
                        Description
                    </Typography>
                    <TextField
                        id="outlined-disabled"
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

export default AddCategorise;
