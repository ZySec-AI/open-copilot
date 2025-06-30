import { useState } from "react";
import Usermanagement from "@/component/profile/systemsetting/UserManagement";
import AppStore from "@/component/profile/systemsetting/AppStore";
import SystemSetting from "@/component/profile/systemsetting/SystemSetting";
import { FaAppStore, FaCog, FaUsers } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs"
import { useParams } from "react-router-dom";
import { GrUserExpert } from "react-icons/gr";
import { ExpertManagement } from "../profile/systemsetting/ExpertManagement";


export function Settings() {
    let params = useParams();
    const [value, setValue] = useState(params.route!);
    const onTabChange = (new_value: string) => {
        setValue(new_value);
    }
    return (
        <>
            <Tabs className="w-full main-container" value={value} onValueChange={onTabChange}>
                <div className="flex w-full justify-center pt-5">
                    <TabsList className="h-min">
                        <TabsTrigger value="general" className="flex flex-row items-center gap-2">
                            <FaCog /> Systems
                        </TabsTrigger>
                        <TabsTrigger value="usermanagement" className="flex flex-row items-center gap-2">
                            <FaUsers /> Users
                        </TabsTrigger>
                        <TabsTrigger value="appstore" className="flex flex-row items-center gap-2">
                            <FaAppStore /> Apps
                        </TabsTrigger>

                        <TabsTrigger value="expertmanagement" className="flex flex-row items-center gap-2">
                            <GrUserExpert /> Experts
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="general"><SystemSetting /></TabsContent>
                <TabsContent value="appstore"><AppStore /></TabsContent>
                <TabsContent value="usermanagement"><Usermanagement /></TabsContent>
                <TabsContent value="expertmanagement"><ExpertManagement /></TabsContent>
            </Tabs>
        </>
    );
}
