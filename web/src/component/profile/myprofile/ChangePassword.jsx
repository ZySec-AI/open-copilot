import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import ChangePasswordModal from "../../modal/ChangePasswordModal";

const ChangePassword = () => {
    const [changepassword, setChangepassword] = useState(false);

    return (
        <div className="flex gap-1">
            <input
                type="password"
                placeholder="*******"
                className="border border-gray-300 p-2 rounded-md w-32"
            />
            <button
                onClick={() => setChangepassword(true)}
                className="flex items-center bg-white py-2 px-3 rounded-md border border-gray-300"
            >
                <BiEditAlt className="text-lg" />
            </button>
            <ChangePasswordModal open={changepassword} handleClose={() => setChangepassword(false)} />
        </div>
    );
};

export default ChangePassword;
