
import { Box, Typography, Modal, Divider, Avatar } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { Modalstyle } from "../style/common.style";
import { useDispatch } from "react-redux";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { useUIContext } from "@/context/BasicProviders";

import { NEW_CHAT, NEW_CHAT_IDS } from "@/redux/chat/chatAction";
import { API_URL } from "@/constant/config";


const ChatEditModal = ({ open, handleClose, setMessages }) => {
    const dispatch = useDispatch();
    const { hndleSelecteuser, setChatIds } = useUIContext();
    const { applications } = useHomeMaster();

    return (
        <Modal open={open} onClose={handleClose}>
            <Modalstyle>
                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ display: "flex", alignItems: "center" }}>
                        Add New Group
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
                <Box sx={{ height: "50vh", overflow: "auto" }}>
                    {applications.map((data, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                if(data?.id){
                                    dispatch({ type: NEW_CHAT_IDS , payload : {id : data.id, addId : true} });
                                }
                                dispatch({ type: NEW_CHAT , payload : true});
                                hndleSelecteuser(data), handleClose(), setChatIds("");
                            }}
                            className="border"
                            sx={{
                                display: "flex",
                                padding: "1rem",
                                justifyContent: "center",
                                m: 1.5,
                                borderRadius: "0.5rem",
                                cursor: "pointer"
                            }}>
                            <Avatar
                                alt="User"
                                src={`${API_URL}/${data?.avatar}`}
                                sx={{
                                    height: "3rem",
                                    width: "3rem",
                                    mt: 1
                                }}></Avatar>
                            <Box sx={{ pl: 2, width: "75%" }}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    {data.expert_name}
                                </Typography>
                                <Typography className="w-50">{data.description}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box sx={{ padding: "1rem" }}></Box>
            </Modalstyle>
        </Modal>
    );
};

export default ChatEditModal;
