import { useEffect, lazy, Suspense, useState } from "react";
import Loader from "@/component/global/Loader";
import { fetchSystem } from "@/redux/system/systemSlice";
import { useAppDispatch, useAppSelector } from "@/hook";
import { GiWorld } from "react-icons/gi";
import { SEARCH_REQUEST } from "@/redux/home/homeAction";
import { BsPlus } from "react-icons/bs";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";

const LazyExpertCard = lazy(() => delayForDemo(import("./ExpertCards")));
const AppStore = () => {
    const dispatch = useAppDispatch();
    const systemStatus = useAppSelector((state) => state.system.status);
    const { appData } = useAppSelector((state) => state.system);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (systemStatus == "idle") {
            dispatch(fetchSystem());
        }
    }, [dispatch, systemStatus]);
    const handleChange = (e: any) => {
        setSearchValue(e.target.value);
        dispatch({ type: SEARCH_REQUEST, payload: e.target.value });
    };

    return (
        <div className="flex justify-center p-10">
            <div className="flex flex-col justify-center h-full max-w-[1100px] overflow-y-scroll pb-10">
                <div className="flex flex-col gap-10">
                    <div className="font-bold text-3xl align-middle">Apps Management</div>
                </div>
                <div className="flex justify-between mt-7">
                    <div>
                        <div className="text-2xl font-bold  ">Applications</div>
                        <div className="text-sm text-gray-500 mt-1">
                            Popular applications made by the community
                        </div>
                    </div>

                    <Button variant="outline">
                        <BsPlus style={{ fontSize: "2rem" }} /> Create App
                    </Button>
                </div>
                <div className="flex justify-between mt-5 ">
                    <div className=" flex items-center p-1 px-2 w-max border bg-gray-100 rounded-2xl ">
                        <GiWorld className="mr-1" />
                        community
                    </div>

                    <Input
                        placeholder="Filter Apps..."
                        onChange={handleChange}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex items-center w-full justify-around">
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 h-full pt-10"
                        style={{ width: "100vw" }}
                    >
                        {appData && appData.length > 0 ? (
                            <Suspense
                                fallback={
                                    <div className="flex justify-center">
                                        <Loader />
                                    </div>
                                }
                            >
                                {appData.filter((item: any) =>
                                    item.name.toLowerCase().includes(searchValue.toLowerCase())
                                ).length > 0 ? (
                                    appData
                                        .filter((item: any) =>
                                            item.name
                                                .toLowerCase()
                                                .includes(searchValue.toLowerCase())
                                        )
                                        .map((item: any) => (
                                            <LazyExpertCard item={item} key={item.id} />
                                        ))
                                ) : (
                                    <div className="w-full h-full flex justify-center items-center">
                                        <p>No results found</p>
                                    </div>
                                )}
                            </Suspense>
                        ) : (
                            <div className="w-full h-full flex justify-center items-center">
                                <p>No data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppStore;

function delayForDemo(promise: any) {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    }).then(() => promise);
}
