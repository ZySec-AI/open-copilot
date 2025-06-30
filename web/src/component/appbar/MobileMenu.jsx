import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, MenuItem, Drawer, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { navData } from "../data/Mockdata";
import { MdClose } from "react-icons/md";

const Colors = tokens();

const MobileMenu = ({ open, onLinkClick }) => {
    const location = useLocation();

    const sideIcon = {
        marginRight: "0.8vh",
        fontSize: "1.5rem"
    };

    return (
        <>
            <Drawer anchor="left" open={open} onClose={onLinkClick}>
                <Box
                    sx={{
                        width: "25vh",
                        padding: "2vh",
                        backgroundColor: Colors.white_color[100]
                    }}
                >
                    <Box sx={{ textAlign: "right", marginBottom: "1rem" }}>
                        <IconButton onClick={onLinkClick}>
                            <MdClose />
                        </IconButton>
                    </Box>
                    {navData.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onLinkClick}
                            style={{
                                color:
                                    location.pathname === item.path
                                        ? Colors.blue_color[100]
                                        : Colors.black_color[100]
                            }}
                        >
                            <MenuItem>
                                {React.createElement(item.icon, { style: sideIcon }, null)}
                                {item.name}
                            </MenuItem>
                        </Link>
                    ))}
                </Box>
            </Drawer>
        </>
    );
};

export default MobileMenu;
