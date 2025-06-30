import React, { useState } from "react";
import { Modal, Box, Typography, styled, Button, Tab, Tabs } from "@mui/material";
import { Modalstyle } from "../style/common.style";
import { FaRegFolderOpen } from "react-icons/fa6";
import { CustomeWhitebutton } from "../style/common.style";
import { SiGoogledrive } from "react-icons/si";

const Label = styled("label")({
    display: "block",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: 500
});

const MoveModal = ({ open, handleClose }) => {
    const [tabValue] = useState(0);

    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle
                sx={{
                    borderRadius: "12px",
                    padding: "1rem"
                }}
            >
                <Label htmlFor="username"> Move (Purchase Agreement) </Label>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography>Current location: </Typography>
                    <CustomeWhitebutton>
                        <SiGoogledrive />
                        Work
                    </CustomeWhitebutton>
                </Box>
                <Box sx={{ height: "20rem" }}>
                    <Tabs value={tabValue} aria-label="Tabs">
                        <Tab label="All" />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <Typography sx={{ display: "flex", gap: 1 }}>
                            <FaRegFolderOpen /> Web Docs
                        </Typography>
                    </TabPanel>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "2rem",
                        marginBottom: "2rem"
                    }}
                >
                    <Typography sx={{ display: "flex", gap: 1 }}>
                        <SiGoogledrive style={{ fontSize: "1.2rem" }} />
                        Select a location to show the folder path
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                        <Button onClick={handleClose} sx={{ marginRight: "1rem" }}>
                            Cancel
                        </Button>
                        <Button variant="contained" disabled>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Box>
    );
};

export default MoveModal;
