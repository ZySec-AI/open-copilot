import ProfileSidebar from "./ProfileSidebar";

const Profileindex = ({ title }) => {
    const ComponentToRender = title;
    return (
        <div className="flex flex-row gap-2 h-full">
            <ProfileSidebar />
            <ComponentToRender />
        </div>
    );
};

export default Profileindex;
