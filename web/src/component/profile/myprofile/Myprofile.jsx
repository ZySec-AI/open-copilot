import { useState } from "react";
import DocTitleheader from "../../global/DocTitleHeader";
import PersonalInfo from "../../modal/PersonalInfo";
import Apikeys from "./Apikeys";
import LogOut from "./LogOut";
import ChangePassword from "./ChangePassword";

import { useAuthMaster } from "@/redux/auth/authReducer";

const MyProfile = () => {
    const [personalInfo, setPersonalInfo] = useState(false);
    const { retrieveUser } = useAuthMaster();

    return (
        <div className="bg-white-100 p-8 rounded-md border border-gray-300 gap-4 mx-11 mt-5">
            <DocTitleheader title="My Profile" />
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Personal Info</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-18">
                    <div>
                        <label className="block text-lg font-normal text-gray-400">Full Name</label>
                        <p>{retrieveUser && retrieveUser.full_name}</p>
                    </div>
                    <div>
                        <label className="block text-lg font-normal text-gray-400">
                            Email Address
                        </label>
                        <p>{retrieveUser && retrieveUser.email}</p>
                    </div>
                    <div>
                        <label className="block text-lg font-normal text-gray-400">Password</label>
                        <ChangePassword />
                    </div>
                </div>
            </div>
            <Apikeys />
            <LogOut />
            <PersonalInfo open={personalInfo} handleClose={() => setPersonalInfo(false)} />
        </div>
    );
};

export default MyProfile;
