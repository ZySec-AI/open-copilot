import { REQUEST_GET_TAGS } from "@/redux/home/homeAction";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Tags = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: REQUEST_GET_TAGS });
  }, [dispatch]);
  const { tags } = useHomeMaster();
  return (
    <div className="space-y-4 w-full">
      <div className="text-xl font-bold flex">Tags</div>
      <div className="flex flex-wrap">
        {tags.map((tag:any) => (
          <Typography
            key={tag}
            className="bg-gray-200 rounded-full px-6 py-1 m-2" // added m-2 for margin
          >
            {tag}
          </Typography>
        ))}
</div>
    </div>
  );
};

export default Tags;
