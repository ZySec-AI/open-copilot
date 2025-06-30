import { Box, Drawer } from "@mui/material";

import { DropdownFolders } from "@/component/documents/DropdownFolders";
import { MdClose } from "react-icons/md";

const DocDashboardMobile = ({ openSearchbar, handleclose, expandedItemsId }) => {
    return (
        <Drawer open={openSearchbar} onClose={handleclose}>
            <Box sx={{ display: "flex", justifyContent: "end", padding: "1rem" }}>
                <MdClose style={{ fontSize: "1.5rem" }} onClick={handleclose} />
            </Box>
            <DropdownFolders expandedItemsId={expandedItemsId} />
        </Drawer>
    );
};

export default DocDashboardMobile;
