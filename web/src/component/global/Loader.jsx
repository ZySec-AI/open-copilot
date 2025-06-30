import { ClipLoader } from "react-spinners";

const Loader = () => {
    return (
        <div
            style={{
                margin: "auto",
                display: "block",
                marginLeft: "40rem"
            }}>
            {" "}
            <ClipLoader color="#0D60D8" />
        </div>
    );
};

export default Loader;
