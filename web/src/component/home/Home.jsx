import { useEffect, useState, useMemo, useRef } from "react";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";  
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import "aos/dist/aos.css";
import { useDispatch } from "react-redux";
import { REQUEST_GET_APPLICATION } from "@/redux/home/homeAction";
import { useUIContext } from "@/context/BasicProviders";
import { useGetFoldersQuery } from "@/redux/folder/folderSlice";
import { Spinner } from "../ui/spinner";
import { API_URL } from "@/constant/config";


const Footer = () => (
  <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 py-4 flex flex-col items-center z-10">
    <div className="text-lg font-semibold">ZySec.AI</div>
    <div className="text-sm text-gray-600">
      Empowering Security with AI for AI
    </div>
    <div className="flex gap-4 mt-2">
      <a
        href="https://zysec.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Website
      </a>
    </div>
    <div className="flex gap-4 mt-2">
      <a
        href="https://github.com/ZySec-AI"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
      </a>
      <a
        href="https://twitter.com/ZySecAI"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter />
      </a>
      <a
        href="https://www.linkedin.com/company/zysec-ai/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin />
      </a>
    </div>
  </footer>
);


export const SearchDropdown = ({
  results,
  closeDropdown,
  setIsSearchModalOpen,
}) => {
  const resent_search_data = JSON.parse(
    localStorage.getItem("selectedItems") || "[]"
  );
  results.unshift(...resent_search_data);

  const { handleSelectUser } = useUIContext();

  const handleItemClick = (item) => {
    const currentItems = JSON.parse(
      localStorage.getItem("selectedItems") || "[]"
    );

    if (!currentItems.includes(item.expert_name)) {
      currentItems.push(item.expert_name);
    }

    localStorage.setItem("selectedItems", JSON.stringify(currentItems));

    handleSelectUser(item);
    closeDropdown?.();
    setIsSearchModalOpen?.(false);
  };

  let uniqueResults = Array.from(new Set(results.map(JSON.stringify))).map(
    JSON.parse
  );

  return (
    <div className="absolute top-full left-0 w-full bg-gray-200 border border-gray-200 rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto ">
      {uniqueResults.length > 0 ? (
        uniqueResults.map((item, index) => (
          <Link
            key={index}
            to={"/ai-chat"}
            className="flex items-center p-2 border-b border-gray-300"
            onClick={() => handleItemClick(item)}
          >
            {typeof item === "object" ? (
              <>
                <Avatar
                  alt={item?.expert_name}
                  src={`${API_URL}/${item.avatar}`}
                />
                <span className="ml-2 ">{item?.expert_name}</span>
              </>
            ) : (
              <>
                <History size={20} />
                <span className="ml-2 ">{item}</span>
              </>
            )}
          </Link>
        ))
      ) : (
        <div className="p-4 ">Experts unavailable</div>
      )}
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch({ type: REQUEST_GET_APPLICATION });
  }, [dispatch]);
  const { isLoading, isError } = useGetFoldersQuery();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      if (searchText) setDropdownVisible(true);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);


  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return <div>Error in loading data.</div>;
  }

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 flex-col" style={{ transform: 'translateY(-10%)' }}>
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-gray-300 opacity-40 select-none">
          Open
        </h1>
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-gray-300 opacity-40 select-none">
          Copilots
        </h1>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
