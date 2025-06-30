import { useState } from "react";
import { Box, Typography, Modal, Button, Divider,TextField, MenuItem } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import { FaFileAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Modalstyle } from "../style/common.style";
import LinearProgress from "@mui/material/LinearProgress";
import { useDispatch } from "react-redux";
import { REQUEST_FILE } from "@/redux/file/fileAction";

const FileInformation = ({ handleUpload }) => {
    return (
        <>
            <Box
                sx={{
                    borderRadius: "5px",
                    paddingBottom: "1rem"
                }}>
                <FileUploader handleChange={handleUpload} name="file" multiple />
            </Box>
        </>
    );
};

const Progress = () => {
    return (
        <>
            <Box sx={{ marginTop: "2rem", border: "2px dashed #0D60D8", padding: "2rem" }}>
                <LinearProgress sx={{ marginTop: "1rem" }} />
                <Typography variant="h7">Selected file: </Typography>
            </Box>
        </>
    );
};
const FileInformationModal = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadFileData, setUploadFileData] = useState({
        description: "",
        categories: "",
        tags: "",
        folder_id: "",
        file: null
    });

    const handleUpload = (file) => {
        setFiles(file);
        setIsLoading(true);
        setTimeout(() => {
            setIsFileUploaded(true);
            setIsLoading(false);
        }, 2600);
    };

    const handleApply = () => {
        const fileListArray = Array.from(files);
        let formData = new FormData();
        formData.append("description", "abc");
        formData.append("categories", "#document");
        formData.append("tags", ["<string>", "<string>"]);
        formData.append("folder_id", "6627b70c1c278848875167de");
        fileListArray.forEach((file, index) => {
            formData.append("file", file);
        });
        dispatch({ type: REQUEST_FILE, payload: formData });
        setIsFileUploaded(false);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose} >
            <Modalstyle>
                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ display: "flex", alignItems: "center" }}>
                        <FaFileAlt /> File Information
                    </Typography>
                    <IoMdClose
                        size={"25px"}
                        onClick={handleClose}
                        style={{
                            cursor: "pointer"
                        }}
                    />
                </Box>
                <Divider />
                <Box sx={{ padding: "1rem" }}>
                  
                    <Typography htmlFor="title" sx={{ gap: 2 }}>
                      Title
                    </Typography>
                    <TextField
                        id="outlined-disabled"
                        name="title"
                        size="small"
                        value="title"
                        disabled
                        sx={{
                            width: "22rem"
                        }}
                    />

                    <Typography htmlFor="author" sx={{ gap: 2,paddingTop:"1rem" }}>
                      Author
                    </Typography>
                    <TextField
                        id="outlined-disabled"
                        name="author"
                        size="small"
                        value="author"
                        disabled
                        sx={{
                            width: "22rem"
                        }}
                    />

                    <Typography htmlFor="category" sx={{ gap: 2, paddingTop:"1rem" }}>
                        Category
                    </Typography>
                    <TextField
                        select
                        id="category"
                        name="category"
                        size="small"
                        defaultValue="Select category"
                        disabled
                        sx={{
                            width: "22rem",
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}>
                        {/* <MenuItem value="admin">Marketing</MenuItem>
                        <MenuItem value="user">Operation</MenuItem> */}
                    </TextField>

                    <Typography htmlFor="createDate" sx={{ gap: 2, paddingTop:"1rem" }}>
                      Create Date
                    </Typography>
                    <TextField
                        id="outlined-disabled"
                        name="createDate"
                        size="small"
                        value="create date"
                        disabled
                        sx={{
                            width: "22rem"
                        }}
                    />

                     <Typography htmlFor="updateDate" sx={{ gap: 2, paddingTop:"1rem" }}>
                      Update Date
                    </Typography>
                    <TextField
                        id="outlined-disabled"
                        name="updateDate"
                        size="small"
                        value="update date"
                        disabled
                        sx={{
                            width: "22rem"
                        }}
                    />

                     <Typography htmlFor="folderName" sx={{ gap: 2,paddingTop:"1rem" }}>
                      Folder Name
                    </Typography>
                    <TextField
                        id="outlined-disabled"
                        name="folderName"
                        size="small"
                        value="folder name"
                        disabled
                        sx={{
                            width: "22rem"
                        }}
                    />
                    {/* <Button
                        sx={{ marginTop: "2rem", marginLeft: "auto", display: "block" }}
                        variant="contained"
                        disabled={!isFileUploaded}
                        onClick={handleApply}>
                         ({files.length})
                    </Button> */}
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default FileInformationModal;
