import { useState } from "react";
import { CustomFileButon } from "../style/common.style";
import { IoMdAdd } from "react-icons/io";
import FileInformationModal from "../modal/FileInformationModal";

const FileInformationButton = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <CustomFileButon className="plusIcon" onClick={() => setOpen(true)}>
                {/* <IoMdAdd /> */}
                File Information
            </CustomFileButon>
            <FileInformationModal open={open} handleClose={() => setOpen(false)} />
        </>
    );
};

export default FileInformationButton;
