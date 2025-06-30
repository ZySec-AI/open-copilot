import { useEffect, useState } from "react";
import { Button } from "@/component/ui/button";
import { Link } from "@mui/material";
import { Switch } from "@/component/ui/switch";
import { BiEditAlt, BiCheck } from "react-icons/bi";
import { toast } from "sonner"
import { useDispatch } from "react-redux";
import { UPDATE_SYSTEM_CONTROLS } from "@/redux/auth/authAction";
import { Input } from "@/component/ui/input";

const ZySecAppAndSettings = ({ configDetails = null }) => {
    // State variables for managing App ID and Secret inputs
    const [isEditing, setIsEditing] = useState(false);
    const [appId, setAppId] = useState("Your-App-ID-Here");
    const [secret, setSecret] = useState("Your-Secret-Here");

    // State variables for system settings toggles
    const [internetEnabled, setInternetEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [expertsEnabled, setExpertsEnabled] = useState(true);
    const [enrichmentsEnabled, setEnrichmentsEnabled] = useState(true);

    // Toggle editing mode
    const handleEdit = () => setIsEditing(!isEditing);
    const handleSave = () => setIsEditing(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setInternetEnabled(configDetails?.enable_internet );
        setNotificationsEnabled(configDetails?.enable_cyber_news );
        setEnrichmentsEnabled(configDetails?.enable_fetch_content );
    }, [configDetails]);

    // Handle changes in internet toggle, affecting dependent settings
    const handleInternetChange = () => {
        const newInternetState = !internetEnabled;
        setInternetEnabled(newInternetState);
        const payload = {
            ...(configDetails || {}),
            enable_internet: newInternetState ? true : false
            
        };
        dispatch({ type: UPDATE_SYSTEM_CONTROLS, payload });
        if (newInternetState) {
            // Show a toast message when the internet is enabled
            toast("Internet enabled");
        } else {
            // Show a toast message when the internet is disabled
            toast("Internet disabled");
        }
        // if (!newInternetState) {
        //     // Disable dependent settings when internet is turned off
        //     setNotificationsEnabled(true);
        //     setExpertsEnabled(false);
        //     setEnrichmentsEnabled(false);
        // }
    };

    // Toggle settings based on internet availability
    const handleNotificationsChange = () => {
        const payload = {
            ...(configDetails || {}), 
            enable_cyber_news: !notificationsEnabled ? true : false
        };
        dispatch({ type: UPDATE_SYSTEM_CONTROLS, payload });
        if (notificationsEnabled) {

            toast("cyber security disabled");
        } else {

            toast("Now you can recieve the Cyber Security news");
        }
        if (internetEnabled) {
            setNotificationsEnabled(!notificationsEnabled);
        }
    };

    const handleExpertsChange = () => {
        if (internetEnabled) {
            setExpertsEnabled(!expertsEnabled);
        }
    };

    const handleEnrichmentsChange = () => {
        const payload = {
            ...(configDetails || {}), 
            enable_fetch_content: !enrichmentsEnabled ? true : false
        };
        dispatch({ type: UPDATE_SYSTEM_CONTROLS, payload });
        if (notificationsEnabled) {

            toast("Now you can fetch content from internet ");
        } else {

            toast("Fetch content disabled");
        }
        if (internetEnabled) {
            setEnrichmentsEnabled(!enrichmentsEnabled);
        }
    };

    return (
        <div className="space-y-4 w-full">
          
            <div className="flex items-center justify-between">
                
                <div className="text-xl font-bold">ZySec App ID & Secret</div>
                <Button onClick={isEditing ? handleSave : handleEdit} variant="outline">
                    {isEditing ? (
                        <>
                            <BiCheck style={{ fontSize: "1.5rem" }} />
                            Save
                        </>
                    ) : (
                        <>
                            <BiEditAlt style={{ fontSize: "1.5rem" }} />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            <div className="space-y-2 px-2">
                <div>
                    App ID
                </div>
                <Input
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    disabled={!isEditing}
                />
                <div>
                    Secret
                </div>
                <Input
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    disabled={!isEditing}
                    type="password"
                />
                <div className="text-muted-foreground">
                    To create a new App ID & Secret, visit{" "}
                    <Link href="https://www.zysec.dev/accounts/register" target="_blank">
                        https://www.zysec.dev/accounts/register
                    </Link>
                    . {/* This link provides a way to register for new credentials */}
                </div>
            </div>

            {/* System Settings */}
            <div className="space-y-4">
                {/* Internet toggle section with description */}
                <div>
                    <div className="flex justify-between align-middle">
                        <div>Internet</div>
                        <Switch
                            checked={internetEnabled}
                            onCheckedChange={handleInternetChange}
                            color="primary"
                        />
                    </div>
                    <div className="font-sans text-muted-foreground">
                        Description: Controls the system's internet connectivity. Disabling will
                        also disable notifications, experts, and fetch content features.
                    </div>
                </div>
                {/* Notifications toggle with conditional enabling */}
                <div>
                    <div className="flex justify-between align-middle">
                        <div>Cyber News</div>
                        <Switch
                            checked={notificationsEnabled}
                            onCheckedChange={handleNotificationsChange}
                            disabled={!internetEnabled} // This switch is disabled when internet is off
                        />
                    </div>
                    <div className="font-sans text-muted-foreground">
                        Description: Manages receiving of cyber security news and updates.
                    </div>
                </div>
                {/* Fetch content toggle for system enrichments */}
                <div>
                    <div className="flex justify-between align-middle">
                        <div>Fetch Content</div>
                        <Switch
                            checked={enrichmentsEnabled}
                            onCheckedChange={handleEnrichmentsChange}
                            disabled={!internetEnabled}
                        />
                    </div>
                    <div className="font-sans text-muted-foreground">
                        Description: Fetches content from external sources, requiring internet
                        connectivity.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZySecAppAndSettings;
