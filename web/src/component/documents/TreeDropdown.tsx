import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/component/ui/dropdown-menu"
import { useUIContext } from "@/context/BasicProviders"
import { useDeleteFileMutation } from "@/redux/file/fileSlice"
import { useDeleteFolderMutation } from "@/redux/folder/folderSlice"
import { useHomeMaster } from "@/redux/home/homeReducer"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


type TreeDropdownProps = {
    type: "folder" | "file", id?: string
}


type TreeDropDownCnstrArgs = {
    setFileUploadPopup: (x: boolean) => void,
    setFolderId: (x?: string) => void,
    setFolderCreationPopup: (x: boolean) => void,
}

const treeDropDownCnstr = ({ setFileUploadPopup, setFolderId, setFolderCreationPopup }: TreeDropDownCnstrArgs): React.FC<TreeDropdownProps> => {
    return function TreeDropDown({ type, id }: TreeDropdownProps) {
        if (type == "folder") {
            return <TreeDropdownFolder
                id={id}
                setFileUploadPopup={setFileUploadPopup}
                setFolderId={setFolderId}
                setFolderCreationPopup={setFolderCreationPopup} />
        }
        return <TreeDropdownFile id={id!} />
    }
}

function TreeDropdownFolder({ id, setFileUploadPopup, setFolderId, setFolderCreationPopup }: {
    id?: string,
    setFileUploadPopup: (x: boolean) => void,
    setFolderId: (x?: string) => void,
    setFolderCreationPopup: (x: boolean) => void,
}) {
    const [deleteFolder] = useDeleteFolderMutation();
    return (
        <DropdownMenuContent>
            <DropdownMenuLabel>Folder</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
                setFolderId(id);
                setFolderCreationPopup(true);
            }}>
                Create New Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(_) => { setFileUploadPopup(true); setFolderId(id); }}>
                Upload File
            </DropdownMenuItem>
            {id &&
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        toast.promise(deleteFolder(id).unwrap(), {
                            loading: "Deleting folder...",
                            success: () => {
                                return "Folder deleted!"
                            },
                            error: () => {
                                return "Error in deleting folder...";
                            },
                        })
                    }}>Delete</DropdownMenuItem>
                </>
            }
        </DropdownMenuContent>
    )
}

function TreeDropdownFile({ id }: { id: string }) {
    const [deleteFile] = useDeleteFileMutation();
    const { applications } = useHomeMaster();
    const { setSelectedUser } = useUIContext();
    const navigate = useNavigate();
    return (
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
                onClick={() => {
                    const myFilesApp = applications.find(
                        (app: any) => app.expert_name === "My Files"
                    );
                    if (myFilesApp) {
                        setSelectedUser(myFilesApp);
                    }
                    navigate("/ai-chat", { state: { fileId: id } });
                }}
            >
                Chat with File
            </DropdownMenuItem>
            <DropdownMenuItem>
                Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={() => {
                    toast.promise(deleteFile(id).unwrap(), {
                        loading: "Deleting File...",
                        success: () => {
                            return "File deleted!"
                        },
                        error: () => {
                            return "Error in deleting file...";
                        },
                    })
                }}
            >
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    )
}

export { treeDropDownCnstr, TreeDropdownFile, TreeDropdownFolder };
