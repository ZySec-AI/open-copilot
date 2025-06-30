import { EllipsisVertical, Folder as FolderIcon } from "lucide-react";
import { useGetFoldersQuery } from "@/redux/folder/folderSlice";
import { Skeleton } from "@/component/ui/skeleton";
import { Tree } from "@/component/ui/tree";
import {
    AccordionPrimitive,
    AccordionContent,
    AccordionTrigger,
} from "@/component/ui/tree"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu"
import { treeDropDownCnstr } from "./TreeDropdown";
import { useMemo, useState } from "react";
import FileUploadPopup from "../modal/FileUploadPopup";
import CreateFolderModal from "../modal/CreateFolderModal";
import { useNavigate, useParams } from "react-router-dom";

const DropdownFolders = ({ expandedItemsId,setTableData }: { expandedItemsId: string[],setTableData:any }) => {
    const { data: folderData, isLoading, isError } = useGetFoldersQuery();
    const [fileUploadPopup, setFileUploadPopup] = useState(false);
    const [folderCreationPopup, setFolderCreationPopup] = useState(false);
    const navigate = useNavigate();
    const { folderId } = useParams();
    const [folderIdForFileCreation, setFolderIdForfileCreation] = useState<string | undefined>(undefined);

    const MenuContent = useMemo(() => treeDropDownCnstr({ setFileUploadPopup, setFolderId: setFolderIdForfileCreation, setFolderCreationPopup }), [setFileUploadPopup, setFolderIdForfileCreation, setFolderCreationPopup]);

    const setFolderId = (id?: string) => {
        if (id) {
            navigate(`/files/${id}`);
        } else {
            navigate(`/files`);
            setTableData({ children: folderData });
        }
    }

    if (isLoading) {
        return <div className="flex flex-col gap-2">
            <Skeleton className="h-[10px] w-full rounded-xl border-b-2 p-10" />
            <Skeleton className="h-[10px] w-full rounded-xl border-b-2 p-10" />
            <Skeleton className="h-[10px] w-full rounded-xl border-b-2 p-10" />
        </div>
    }

    if (isError) {
        return <div>
            Error in loading data. Check your internet connection!
        </div>
    }


    return (
        <>
            <AccordionPrimitive.Root type="multiple" defaultValue={["root"]} >
                <AccordionPrimitive.Item value="root">
                    <AccordionTrigger onClick={() => {
                        setFolderId("");
                    }} className="group">
                        <span className="text-sm truncate">Home</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="ml-auto" onClickCapture={(e) => e.stopPropagation()} asChild>
                                <EllipsisVertical
                                    className="h-4 w-4 invisible text-accent-foreground/50 duration-100 group-hover:visible ml-auto"
                                />
                            </DropdownMenuTrigger>
                            <MenuContent type="folder" />
                        </DropdownMenu>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Tree
                            data={folderData ?? []}
                            className="flex-shrink-0 h-full"
                            initialSelectedItemId={folderId}
                            onSelectChange={(item) => {
                                setFolderId(item?.id ?? "")
                                setTableData(item);
                            }}
                            expandedItemIds={expandedItemsId}
                            folderIcon={FolderIcon}
                            itemIcon={FolderIcon}
                            menuContent={MenuContent}
                        />
                    </AccordionContent>
                </AccordionPrimitive.Item>
            </AccordionPrimitive.Root>
            <FileUploadPopup open={fileUploadPopup} setOpen={setFileUploadPopup} parentFolderId={folderIdForFileCreation} />
            <CreateFolderModal open={folderCreationPopup} setOpen={setFolderCreationPopup} parentFolderId={folderIdForFileCreation} />
        </>
    )
}

export { DropdownFolders };

