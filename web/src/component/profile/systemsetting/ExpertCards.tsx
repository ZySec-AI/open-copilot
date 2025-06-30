import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/component/ui/avatar";
import Rating from "@mui/material/Rating";
import { tokens } from "../../../theme";
import ViewExpertModal from "./ViewExpertModel";

import AOS from "aos";

const Colors = tokens();

const ExpertCard = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(4);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div>
      <div
        onClick={() => {
          setOpen(true);
        }}
        style={{ background: "#f0f7ff" }}
        data-aos="fade-down"
        data-aos-duration="500"
        className="
        flex flex-col  items-center w-full border shadow-md rounded-xl hover:scale-110  duration-200 hover:shadow-xl p-4 h-full max-w-[400px] pt-7"
      >
        <div className="flex justify-between w-full">
          <div>
            <div className="pt-3">
              <Avatar>
                <AvatarImage src={item.logo_url} alt={item.name} />
                <AvatarFallback>ZySec App</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col justify-end ">
            <div className="pt-3">
              <Rating
                name="half-rating"
                precision={0.5}
                value={item.rating}
                onChange={(_event, newValue) => {
                  setRating(newValue!);
                }}
              />
            </div>
            <div className="px-3">({item.rating})</div>
          </div>
        </div>
        <div className="flex justify-start w-full capitalize font-semibold pt-4">
          {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
        </div>

        <div className="text-gray-600 py-2 text-sm">
          {item.description
            ? item.description.slice(0, 45) +
              (item.description.length > 45 ? "..." : "")
            : "No description available."}
        </div>

        <div className="flex w-full justify-between pt-5 items-center font-semibold ">
          Categories
        </div>
        <div
          className="flex flex-wrap gap-2 justify-start py-2 w-full"
          style={{ height: "5.5rem" }}
        >
          {item.label.map((labelItem: any, index: number) => {
            return (
              <div key={index}>
                <div
                  className="capitalize text-sm text-gray-500	  rounded-lg"
                  style={{
                    backgroundColor: Colors.blue_color[200],
                    padding: "0.2rem 0.6rem",
                 
                  }}
                >
                  {labelItem}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ViewExpertModal item={item} open={open} setOpen={setOpen} />
    </div>
  );
};

export default ExpertCard;
