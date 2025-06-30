import { Typography } from "@mui/material";
import React from "react";

const DocTitleheader = ({ title }) => {
    return (
        <>
            <Typography variant="h5" sx={{ paddingBottom: "10px ", fontWeight: "600" }}>
                {title}
            </Typography>
        </>
    );
};

export default DocTitleheader;
