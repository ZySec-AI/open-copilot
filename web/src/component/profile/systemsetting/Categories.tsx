import React, { useState } from "react";
import { useGetCategoriesQuery } from "@/redux/folder/folderSlice";
import { Button, CircularProgress, Typography } from "@mui/material";
import { BsPlus } from "react-icons/bs";
import CreateCategory from "@/component/modal/CreateCategory";
import { color } from "framer-motion";

const Categories = () => {
  const { data: categoryData, isLoading, refetch } = useGetCategoriesQuery();
  const [category, setCategory] = useState(false);

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center">
        <div className="text-xl font-bold flex">Categories</div>

        <BsPlus
          onClick={() => setCategory(true)}
          style={{ fontSize: "2rem", marginTop: "4px",marginLeft:'10px', color: "black" }}
          className="bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 "
        />
      </div>
      <div className="mt-1 flex  gap-4 overflow-auto min-w-full">
        {isLoading ? (
          <CircularProgress size={20} style={{ color: "black" }} />
        ) : categoryData ? (
          categoryData.map((category, index) => (
            <Typography
              className="flex items-center gap-2 bg-gray-100 p-1 border rounded-xl cursor-pointer pl-2"
              key={index}
            >
              {category.name}
            </Typography>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
      <CreateCategory
        open={category}
        handleClose={() => {
          setCategory(false);
          refetch();
        }}
      />
    </div>
  );
};

export default Categories;
