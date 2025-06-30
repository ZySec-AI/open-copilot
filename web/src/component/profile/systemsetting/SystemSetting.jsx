// system-settings
import React from "react";
import { useAuthMaster } from "@/redux/auth/authReducer";
import ZysecApp from "./ZySecAccount";
import ZySecMode from "./ZySecMode";
import { useDispatch } from "react-redux";
import { GET_CONFIGS_DETAILS } from "@/redux/auth/authAction";
import { GiWorld } from "react-icons/gi";
import Categories from "./Categories";
import Tags from "./Tags";


const SystemSetting = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch({ type: GET_CONFIGS_DETAILS });
    }, [dispatch]);
    const { configDetails } = useAuthMaster();


    return (
        <div className="main-container flex justify-center">
            <div className="flex flex-col  max-w-[1200px] p-10 w-full h-full gap-8">
                <div className="text-3xl font-bold">System Controls</div>
                <div className="flex justify-between ">
                    <div>
                        <div className="text-2xl font-bold  ">System</div>
                        <div className="text-sm text-gray-500 ">
                            Popular assistants made by the community
                        </div>
                    </div>

            
                </div>
                <div className="flex justify-between ">
                    <div className=" flex items-center p-1 px-2 w-max border bg-gray-100 rounded-2xl ">
                        <GiWorld className="mr-1" />
                        community
                    </div>


                </div>
                <div className="flex flex-col items-center w-full h-full overflow-y-auto space-y-10">
                    <ZysecApp configDetails={configDetails} />
                    <ZySecMode configDetails={configDetails} />
                    <Categories/>
                    {/* <Tags/> */}
                </div>
            </div>
        </div>
    );
};

export default SystemSetting;
