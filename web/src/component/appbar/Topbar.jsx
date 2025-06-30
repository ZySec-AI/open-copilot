import { Avatar, Badge, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import { Bell, TriangleAlert } from "lucide-react";
import Divider from "@mui/material/Divider";
import { Button } from "flowbite-react";

import logo from "../../images/Logo.webp";
import { Popover, PopoverContent, PopoverTrigger } from "@/component/ui/popover";


export const MainLogoHeader = () => {
    const Colors = tokens();
    return (
        <>
            <Link to="/">
                <Typography
                    variant="h6"
                    sx={{
                        color: Colors.blue_color[100],
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}>
                    <img src={logo} alt={logo} width="48" />
                    <div className="text-xl m-0 p-0">
                    CyberPod AI
            <p className="text-xs text-red">Open Source Copilots <span className="text-neutral-600"> alphav1.0</span></p>
                 </div>
                </Typography>
            
            </Link>
        </>
    );
};

export const LoginUser = ({ retrieveUser }) => {
    const Colors = tokens();

    return (
        <>
            <Link to="/myprofile">
                <Avatar
               
                    sx={{
                        bgcolor: Colors.blue_color[300],
                        height: "2rem",
                        width: "2rem",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}>
                    {retrieveUser.full_name ? retrieveUser.full_name.charAt(0).toUpperCase() : ""}
                </Avatar>
            </Link>
        </>
    );
};

export const Notification = () => {
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <Badge badgeContent={3} color="error">
                        <Bell />
                    </Badge>
                </PopoverTrigger>
                <PopoverContent className=" p-0 mr-3">
                    <ul className="notificationListing">
                        <li>
                            <TriangleAlert className="alertIcon" />
                            <span className="notRead"></span>{" "}
                            <span className="notivalue">Risky Asset</span>
                        </li>
                        <li>
                            <TriangleAlert className="alertIcon" />
                            <span className="notivalue">CVE Notification</span>
                            <span className="notRead"></span>
                        </li>
                        <li>
                            <TriangleAlert className="alertIcon" />
                            <span className="notivalue">Threat Alert</span>
                            <span className="notRead"></span>
                        </li>
                        <li>
                            <TriangleAlert className="alertIcon" />
                            <span className="notivalue">CVE Notification</span>
                            <span className="notRead"></span>
                        </li>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Button onClick={() => alert("Archive all notifications")} fullWidth>
                            Clear Alerts
                        </Button>{" "}
                        {/* Archive All button */}
                    </ul>
                </PopoverContent>
            </Popover>
        </>
    );
};
