import { useEffect, useState } from "react";
import ContentSidebar from "./ContentSidebar";
import ContentBlog from "./ContentBlog";
import { IoMdArrowDropup } from "react-icons/io";
import PlaybooksDrawer from "./PlaybooksDrawer";
import { useCustomTheme } from "../style/common.style";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hook";
import { useGetCategoriesQuery } from "@/redux/folder/folderSlice";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";

const MobileMangeplaybooks = ({ setOpenMenu }: { setOpenMenu: (x: boolean) => void }) => {
    return (
        <div className="border border-gray-300 w-full p-4 bg-white">
            <div
                onClick={() => setOpenMenu(true)}
                className="flex justify-end items-center gap-1 cursor-pointer">
                Manager Playbooks <IoMdArrowDropup />
            </div>
        </div>
    );
};

const Contentindex = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { matches } = useCustomTheme();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { currentData: categoryData, isLoading, isError } = useGetCategoriesQuery();

    const fetchContent = () => {
        setSelectedCategory("");
    };

    useEffect(() => {
        fetchContent();
    }, [location, dispatch]);

    const handleFilter = (id: string, name: string) => {
        setSelectedCategory(name);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return <div>Error in loading data..</div>;
    }

    return (
        <>
            {matches && <MobileMangeplaybooks setOpenMenu={setOpenMenu} />}
            <div className="flex">
                {!matches && (
                    <ContentSidebar
                        categoryData={categoryData}
                        selectedCategory={selectedCategory}
                        handleFilter={handleFilter}
                        fetchContent={fetchContent}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                )}
            </div>
            <ContentBlog
                playbookData={[]}
                contentLoading={false}
                fetchContent={fetchContent}
                searchTerm={searchTerm}
            />
            {matches && (
                <PlaybooksDrawer openmenu={openMenu} handleClose={() => setOpenMenu(false)} />
            )}
        </>
    );
};

export default Contentindex;
