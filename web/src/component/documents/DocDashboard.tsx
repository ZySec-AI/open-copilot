import { useState } from "react";
import { Box } from "@mui/material";
import { DropdownFolders } from "@/component/documents/DropdownFolders";
import { DashboardFileList } from "./DashboardFilelist";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { useCustomTheme } from "../style/common.style";
import DocDashboardMobile from "./DocDashboardMobile";
import { useParams } from "react-router-dom";
import { useGetFoldersQuery } from "@/redux/folder/folderSlice";
import { useExpandedItems } from "@/hooks/use-expanded-items";
import { Spinner } from "@/component/ui/spinner";
import { DocPath } from "./DocPath";
import { cn } from "@/lib/utils";

const Docdashboard = () => {
    const { matches } = useCustomTheme();
    const { folderId } = useParams();
    const [openSearchbar, setOpensearchbar] = useState(false);
    const { data: folderData = [], isLoading, isError } = useGetFoldersQuery();
    const [expandedItemsId, names] = useExpandedItems(folderData, false, folderId);
    const [tableData,setTableData] = useState<any>({});

    if (isLoading) {
        return <Spinner size="large" />
    }

    if (isError) {
        return <div>
            Error in loading data.
        </div>
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
                {matches ? (
                    <HiBars3BottomLeft
                        onClick={() => setOpensearchbar(true)}
                        style={{ fontSize: "2rem" }}
                    />
                ) : null}
            </Box>
            <div className="flex flex-row h-screen">
                {!matches && <div className="w-1/4 p-4 border-r h-[90vh]">
                    <DropdownFolders expandedItemsId={expandedItemsId} setTableData={setTableData}/>
                </div>}

                <div className={cn("flex flex-col gap-2 sm:w-full p-4", !matches ? "w-full" : "w-3-4")}>
                    <DocPath  setTableData={setTableData} expandedItemsIds={expandedItemsId} names={names} />
                    <DashboardFileList folderId={folderId} folderData={folderData} tableData={tableData} setTableData={setTableData}/>
                  
                </div>
            </div>
            <DocDashboardMobile
                openSearchbar={openSearchbar}
                handleclose={() => setOpensearchbar(false)}
                expandedItemsId={expandedItemsId}
            />
        </>
    );
};

export default Docdashboard;
