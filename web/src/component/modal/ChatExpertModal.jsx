import { Box, Typography, Modal, Divider, Avatar } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { Modalstyle } from "../style/common.style";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { useUIContext } from "@/context/BasicProviders";
import { useChatMaster } from "@/redux/chat/chatReducer";
import { toast } from "sonner";
import { API_URL } from "@/constant/config";
import chatServices from "@/services/chat.services";


const ChatExpertModal = ({ open, handleClose,handleExperts }) => {
    const { setExpertUser } = useUIContext();
    const { applications } = useHomeMaster();
    const { chatId } = useChatMaster();

    const addNewExprt = async (data) => {
        if (chatId) {
            try {
                const response = await chatServices.groupChat(data.id, chatId);
                toast.success("Expert added successfully");
                setExpertUser(data);
                handleExperts(response.data?.expert_ids)
            } catch (error) {
                toast.error("Expert already in Chat");
            }
        } else {
            toast.error("You cannot add an expert without chat id");
        }
        handleClose();
    }

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
                                addNewExprt(data)
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

export default ChatExpertModal;
