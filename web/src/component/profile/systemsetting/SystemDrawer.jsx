import { Box, Button, Drawer, Typography } from "@mui/material";
import React from "react";
import { Systemnavdata } from "../../data/Mockdata";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";
import { MdClose } from "react-icons/md";

const SystemDrawer = ({ issystemmenu, handleclose }) => {
    const Colors = tokens();
    return (
        <>
            <Drawer anchor="right" open={issystemmenu} onClose={handleclose}>
                <Box sx={{ textAlign: "left" }}>
                    <Button onClick={handleclose}>
                        <MdClose style={{ fontSize: "2rem", color: "black" }} />
                    </Button>
                </Box>
                <Box
                    sx={{
                        width: "18rem",
                        padding: "1rem",
                        fontSize: "1.4rem",
                        backgroundColor: Colors.white_color[100]
                    }}
                >
                    {Systemnavdata.map((value) => (
                        <Link to={value.path} key={value.id}>
                            <Typography
                                onClick={() => handleclose()}
                                sx={{
                                    fontSize: "1.2rem",
                                    display: "flex",
                                    gap: 2,
                                    padding: "0.5rem 0rem",
                                    alignItems: "center",
                                    color:
                                        location.pathname === value.path
                                            ? "#0D60D8"
                                            : Colors.black_color[200]
                                }}
                            >
                                {value.icon} {value.name}
                            </Typography>
                        </Link>
                    ))}
                </Box>
            </Drawer>
        </>
    );
};

export default SystemDrawer;
