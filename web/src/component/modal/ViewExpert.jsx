import React from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Divider,
    Avatar,
    Switch,
    styled,
    InputAdornment,
    Grid
} from "@mui/material";
import { Modalstyle, Customeuploadbutton, CustomFeaturesButton } from "../style/common.style";
import { tokens } from "../../theme";
import Rating from "@mui/material/Rating";
import FormControlLabel from "@mui/material/FormControlLabel";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { MdInsertLink } from "react-icons/md";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { MdContentCopy } from "react-icons/md";
const Colors = tokens();
const Label = styled("label")({
    display: "block",
    fontSize: "1.2rem",
    fontWeight: 500,
    marginBottom: "0.5rem"
});

const ViewExpert = ({ open, handleClose }) => {
    const [value, setValue] = React.useState(2);

    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle sx={{ height: "45rem", overflow: "auto" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", padding: "1rem" }}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: Colors.blue_color[300],
                                    fontSize: "2rem"
                                }}
                            >
                                O
                            </Avatar>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6">Virtual Assistance</Typography>
                                <Rating
                                    name="simple-controlled"
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                />
                                <CustomFeaturesButton>
                                    Website
                                    <MdInsertLink />
                                </CustomFeaturesButton>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                            <HighlightOffOutlinedIcon
                                onClick={handleClose}
                                sx={{ marginLeft: "auto", display: "block", cursor: "pointer" }}
                            />
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" />}
                                label="Enable / Disable"
                                labelPlacement="start"
                            />
                            <CustomFeaturesButton>
                                <PublicOutlinedIcon /> Has internet access
                            </CustomFeaturesButton>
                        </Box>
                    </Grid>
                </Grid>

                <Divider />
                <Box sx={{ padding: "1.4rem", width: "100%" }}>
                    <Label variant="h6">About Virtual Assistance</Label>
                    <Typography
                        sx={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            marginTop: "0.5rem",
                            width: "100%",
                            maxWidth: "38rem"
                        }}
                    >
                        IPAPI.CO is a dedicated service designed to efficiently identify and resolve
                        IP network loops and conflicts, enhancing network reliability and
                        performance through accurate diagnostics..
                    </Typography>
                    <Typography
                        sx={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            marginTop: "1rem",
                            width: "100%",
                            maxWidth: "38rem"
                        }}
                    >
                        This expert will tell you everything you ask about IP Addresses.
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                        <Grid item xs={12} sm={6}>
                            <Label variant="h6">App ID</Label>
                            <TextField
                                id="outlined-disabled"
                                defaultValue="Venky API Key (2022-47-20 13:17:23)"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <MdContentCopy />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Label variant="h6">Secret Key</Label>
                            <TextField
                                id="outlined-disabled"
                                defaultValue="Venky API Key (2022-47-20 13:17:23)"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <ContentCopyOutlinedIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Label variant="h6" sx={{ marginTop: "1rem" }}>
                        Write a review
                    </Label>
                    <TextField
                        id="outlined-multiline-static"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            paddingTop: "1rem",
                            gap: "1rem"
                        }}
                    >
                        <Customeuploadbutton>Submit</Customeuploadbutton>
                    </Box>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default ViewExpert;
