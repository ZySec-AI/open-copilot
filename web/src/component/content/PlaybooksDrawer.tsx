import { Box, Drawer } from "@mui/material";
import ContentSidebar from "./ContentSidebar";
import { MdClose } from "react-icons/md";

const PlaybooksDrawer = ({ openmenu, handleClose }:{openmenu:any, handleClose:any}) => {
    return (
        <>
            <Drawer open={openmenu} onClose={handleClose}>
                <Box sx={{ display: "flex", justifyContent: "end", padding: "1rem 1rem 0rem" }}>
                    <MdClose style={{ fontSize: "1.5rem" }} onClick={handleClose} />
                </Box>
                <ContentSidebar handleClose={handleClose} />
            </Drawer>
        </>
    );
};

export default PlaybooksDrawer;
