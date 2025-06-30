import React, { useEffect, useState } from "react";
import { Avatar, TextField, Switch } from "@mui/material";
import { Link } from "react-router-dom";
import { GiWorld } from "react-icons/gi";
import { FaEdit } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { SEARCH_REQUEST } from "@/redux/home/homeAction";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { useUIContext } from "@/context/BasicProviders";
import AOS from "aos";
import { CreateAssistanceModal } from "../systemsetting/CreateAssistanceModal";
import Loader from "@/component/global/Loader";
import {
  useEditExpertMutation,
  useGetExpertsQuery,
} from "@/redux/expert/expertSlice";
import { toast } from "sonner";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { API_URL } from "@/constant/config";
import { fetchSystem } from "@/redux/system/systemSlice";
import { useAppSelector } from "@/hook";

interface Item {
  expert_name: string;
  avatar: string;
  description: string;
  is_active: boolean;
}

const AiExpert = ({ item }: { item: Item }) => {
  const [editExpert] = useEditExpertMutation();
  const { hndleSelecteuser } = useUIContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingModalOpen, setSettingIsModalOpen] = useState(false);
  const [expertName, setExpertName] = useState(item.expert_name);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(item.avatar);
  const [description, setDescription] = useState(item.description);
  const [isActive, setIsActive] = useState(item.is_active);
  const dispatch = useDispatch();

  const doGet = async () => {};

  const handleEditChange = async (data: any) => {
    setSettingIsModalOpen(false);
    if (!expertName) {
      console.log("Expert name is required");
      return;
    }
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("expert_name", expertName);
    formData.append("description", description);
    formData.append("is_active", isActive.toString());
    formData.append("created_by", data.created_by);
    formData.append("created_at", data.created_at);
    formData.append("updated_at", data.updated_at);
    formData.append("updated_by", data.updated_by);
    formData.append("category", data.category);
    formData.append("enable_history", data.enable_history);
    formData.append("internet_required", data.internet_required);
    formData.append("system_prompt", data.system_prompt);
    formData.append("type", data.type);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    toast.promise(editExpert({ formdata: formData, id: data?.id }).unwrap(), {
      loading: "Updating expert...",
      success: () => {
        doGet();
        return "Updated successfully";
      },
      error: () => {
        return "Error in updating data";
      },
    });
  };

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };
  const handleSettingsClick = () => {
    setSettingIsModalOpen(true);
  };
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseSettingModal = () => {
    setSettingIsModalOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div
        className="flex flex-col bg-blue-50 items-center h-full w-50  border-gray p-10 gap-2
         border shadow-md rounded-xl  duration-200 hover:shadow-xl"
        onClick={() => {
          handleAvatarClick();
          hndleSelecteuser(item);
        }}
      >
        <Avatar
          alt={item.expert_name}
          src={`${API_URL}/${item.avatar}?v=${Math.random()}`}
          sx={{ width: 48, height: 48 }}
          onClick={handleAvatarClick}
        />
        <div className="flex flex-col items-center text-center gap-3">
          <Link className="font-semibold text-black text-lg">
            {item.expert_name.length > 10 ? (
              <>
                {item.expert_name.slice(0, 20)}
                <br />
                {item.expert_name.slice(20)}
              </>
            ) : (
              item.expert_name
            )}
          </Link>
          <p className="text-sm">{item.description}</p>
          <p className="text-sm text-gray-500 mt-4">
            Created by{" "}
            {item?.created_by?.full_name
              ? item?.created_by?.full_name
              : "demo1"}
          </p>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 w-full flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white border p-8 rounded-2xl w-[20vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <div
                onClick={handleSettingsClick}
                className="flex items-center rounded-xl border-gray-200 w-min px-1"
              >
                <FaEdit size={20} color="gray" />
              </div>
              {isSettingModalOpen && (
                <div
                  className="fixed inset-0 w-full flex justify-center items-center bg-black bg-opacity-50 z-50"
                  onClick={handleCloseSettingModal}
                >
                  <div
                    className="bg-white border p-8 rounded-2xl sm:max-w-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="flex justify-center font-semibold">
                      Edit Your Details Here
                    </h2>
                    <div className="flex justify-center">
                      <Avatar
                        alt={avatarPreview}
                        src={avatarPreview}
                        sx={{ width: 48, height: 48 }}
                      />
                    </div>
                    <div className="flex flex-col my-2 w-[20vw]">
                      <div className="flex font-semibold">Avatar</div>
                      <TextField
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    <div className="flex flex-col my-2 w-[20vw]">
                      <div className="flex font-semibold">Name</div>
                      <TextField
                        className="w-full"
                        value={expertName}
                        onChange={(e) => setExpertName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col my-2 w-[20vw]">
                      <div className="flex font-semibold mt-2">Description</div>
                      <TextField
                        className="w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex font-semibold mt-2">
                        {isActive ? "Activate" : "Deactivate"}
                      </div>
                      <Switch
                        checked={isActive}
                        onChange={handleToggle}
                        name="isActive"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </div>

                    <div
                      onClick={handleCloseSettingModal}
                      className="flex justify-center m-3 border rounded-3xl bg-gray-200"
                    >
                      <div className="cursor-pointer text-black p-1">
                        Cancel
                      </div>
                    </div>
                    <div
                      onClick={() => handleEditChange(item)}
                      className="cursor-pointer flex justify-center m-3 border rounded-3xl bg-blue-500"
                    >
                      <div className="text-white p-1">Save</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Avatar
              alt={item.expert_name}
              src={`${API_URL}/${item.avatar}?v=${Math.random()}`}
              sx={{ width: 64, height: 64 }}
              className="mx-auto"
            />
            <h2 className="text-xl flex justify-center font-bold mt-4">
              {item.expert_name}
            </h2>
            <h2 className="text-sm flex justify-center text-center font-semibold mt-4">
              {item.description}
            </h2>

            <p className="text-sm flex justify-center text-gray-500 mt-4">
              Created by Zysec
            </p>
            <div className="py-2">
              <div
                onClick={handleCloseModal}
                className="cursor-pointer flex justify-center m-3 border rounded-3xl bg-gray-200"
              >
                <div className="text-black p-1">Cancel</div>
              </div>
              <Link
                to="/ai-chat"
                className="cursor-pointer flex justify-center m-3 border rounded-3xl bg-blue-500"
              >
                <div className="text-white p-1">Start Chatting</div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ExpertManagement = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const systemStatus = useAppSelector((state:any) => state.system.status);

  const { data: applications } = useGetExpertsQuery();
  const { searchData } = useHomeMaster();

  const handleChange = (e: any) => {
    dispatch({ type: SEARCH_REQUEST, payload: e.target.value });
  };
  useEffect(() => {
    if (systemStatus == "idle") {
        dispatch(fetchSystem());
    }
}, [dispatch, systemStatus]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex justify-center p-10">
      <div className="flex flex-col m-0 px-10 h-full w-full max-w-[1200px] gap-8">
        <div className="text-3xl font-bold">Experts Management</div>
        <div className="flex justify-between">
          <div>
            <div className="text-2xl font-bold">Assistance</div>
            <div className="text-sm text-gray-500">
              Popular assistants made by the community
            </div>
          </div>

          <Button onClick={handleOpenModal} variant="outline">
            <BsPlus style={{ fontSize: "2rem" }} /> Create Assistant
          </Button>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center p-1 px-2 w-max border bg-gray-100 rounded-2xl">
            <GiWorld className="mr-1" />
            community
          </div>

          <Input
            placeholder="Filter experts..."
            onChange={handleChange}
            className="max-w-sm"
          />
        </div>

        <div className="flex-column justify-center">
          <div className="grid lg:grid-cols-4 gap-3 sm:grid-cols-3 grid-cols-2">
            {searchData && searchData.length > 0 ? (
              searchData.map((item: Item, index: number) => (
                <AiExpert item={item} key={index} />
              ))
            ) : applications?.length > 0 ? (
              applications?.map((item: Item, index: number) => (
                <AiExpert item={item} key={index} />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
      <CreateAssistanceModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
};

export { ExpertManagement };
