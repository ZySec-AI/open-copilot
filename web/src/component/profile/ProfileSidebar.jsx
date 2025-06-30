import { Systemnavdata } from "../data/Mockdata";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import { tokens } from "../../theme";

const Colors = tokens();

const ProfileSidebar = () => {
    const location = useLocation();
    return (
        <div className="w-3/12 items-center hidden lg:block h-full">
            <div className="flex gap-5 items-center w-full p-4">
                <Avatar
                    sx={{
                        bgcolor: Colors.blue_color[300],
                        height: "2rem",
                        width: "2rem"
                    }}
                >
                    O
                </Avatar>
                <div className="flex flex-col">
                    <div className="capitalize font-bold text-xl">nelson mich</div>
                    <div>Nelsonmich@gmail</div>
                </div>
            </div>
            <div className="flex flex-col gap-5 py-10 px-4 w-full">
                {Systemnavdata.map((item) => {
                    return <Link to={item.path} key={item.id}>
                        <div className={`${location.pathname == item.path ? "flex flex-row gap-5 text-xl text-blue-800" : "flex flex-row gap-5 text-xl text-gray-800"}`}>
                            {item.icon} {item.name}
                        </div>
                    </Link>
                })}
            </div>
        </div>
    );
};

export default ProfileSidebar;
