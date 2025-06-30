import { useEffect } from "react";
import { BsPlus } from "react-icons/bs";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { CREATE_APIKEY_REQUEST, DELETE_API_KEY, GET_APIKEY_REQUEST } from "@/redux/auth/authAction";
import { useAuthMaster } from "@/redux/auth/authReducer";
import { IoCopy } from "react-icons/io5";

const Apikeys = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: GET_APIKEY_REQUEST });
    }, []);
    const { apiKeys } = useAuthMaster();
    return (
        <>
            <div className="p-4 rounded-md border border-gray-300 mt-7">
                <div className="flex justify-between">
                    <div>
                        <h6 className="text-xl">API Keys</h6>
                        <p className="text-gray-500">
                            ZySec ID Keys let you use ZySec from within other tools or your own
                        </p>
                    </div>
                    <button
                        onClick={() => dispatch({ type: CREATE_APIKEY_REQUEST })}
                        className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md">
                        <BsPlus className="mr-1 text-2xl" />
                        New Api Key
                    </button>
                </div>
                {apiKeys && apiKeys.length > 0 ? (
                    apiKeys.map((item, key) => (
                        <div className="flex">
                            <div className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md mt-4 flex items-center justify-between">
                                <div>{item}</div>
                                <div className="cursor-pointer flex gap-1 text-gray-500 text-lg">
                                    <IoCopy onClick={() => navigator.clipboard.writeText(item)} />
                                    <RiDeleteBin7Fill
                                        onClick={() =>
                                            dispatch({ type: DELETE_API_KEY, payload: item })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>no data</p>
                )}
            </div>
        </>
    );
};

export default Apikeys;
