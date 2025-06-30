import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, MenuItem, Drawer } from "@mui/material";
import { tokens } from "../../theme";
import { MdSettingsSuggest } from "react-icons/md";
import { navData } from "../data/Mockdata";
import { LoginUser } from "../appbar/Topbar";

const Colors = tokens();

const MobileMenu = ({ open, onLinkClick }) => {
    const location = useLocation();

    const sideIcon = {
        marginRight: "0.8vh",
        fontSize: "1.5rem"
    };

    return (
        <>
            <Drawer anchor="left" open={open} onClick={onLinkClick}>
                <Box
                    sx={{
                        width: "25vh",
                        padding: "2vh",
                        backgroundColor: Colors.white_color[100]
                    }}
                >
                    <Box sx={{ pl: 2, pb: 2, display: "flex", gap: 2 }}>
                        <LoginUser />
                        <Link to="/system-settings">
                            <MdSettingsSuggest style={{ fontSize: "1.6rem" }} />
                        </Link>
                    </Box>

                    {navData.map((item, index) => (
                        <Link
                            key={index}
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
