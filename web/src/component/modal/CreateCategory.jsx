import { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    styled,
    Divider,
    Button,
   
} from "@mui/material";
import { Modalstyle, Customeuploadbutton } from "../style/common.style";
import { useDispatch } from "react-redux";
import { CREATE_CATEGORY_REQUEST } from "@/redux/auth/authAction";
import { useGetCategoriesQuery } from "@/redux/folder/folderSlice";


const Label = styled("label")({
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 500,
    margin: "1rem",
});

const CreateCategory = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { currentData: categoryData } = useGetCategoriesQuery();
    const [categoriesData, setcategoryData] = useState({});

    const handleChange = (event) => {
        if (event.target.name === "roles") {
            const rolesArray = event.target.value.split(",");
            setcategoryData({
                ...categoriesData,
                roles: rolesArray,
            });
        } else {
            setcategoryData({
                ...categoriesData,
                [event.target.name]: event.target.value,
            });
        }
    };

    const createCategorysubmit = async () => {
        try {
            await dispatch({ type: CREATE_CATEGORY_REQUEST, payload: {data:categoriesData, actions: handleClose} });
           ;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle>
                <Label htmlFor="username">Create Category</Label>
                <Divider />
                <Box sx={{ padding: "1.4rem 2rem" }}>
                    <Typography htmlFor="Full Name">Category Name</Typography>
                    <TextField
                        placeholder="Category Name"
                        size="small"
                        sx={{
                            width: "22rem",
                        }}
                        onChange={handleChange}
                        name="name"
                    />
                    <Typography
                        htmlFor="Description"
                        sx={{ gap: 2, paddingTop: "1rem" }}
                    >
                       Description
                    </Typography>
                    <TextField
                        placeholder="Descrpition"
                        size="small"
                        sx={{
                            width: "22rem",
                        }}
                        onChange={handleChange}
                        name="description"
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            paddingTop: "1rem",
                            gap: "1rem",
                        }}
                    >
                        <Button onClick={handleClose}>Cancel</Button>
                        <Customeuploadbutton onClick={createCategorysubmit}>
                            Add
                        </Customeuploadbutton>
                    </Box>
                </Box>
            </Modalstyle>
        </Modal>
    );
};

export default CreateCategory;
