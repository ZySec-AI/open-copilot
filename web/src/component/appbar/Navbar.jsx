import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { MainLogoHeader, LoginUser } from "./Topbar";
import { MdSettingsSuggest } from "react-icons/md";
import { useMediaQuery } from "@mui/material";
import { IoIosMenu } from "react-icons/io";
import MobileMenu from "./MobileMenu";
import { navData } from "../data/Mockdata";
import { useCustomTheme } from "../style/common.style";
import SystemDrawer from "../profile/systemsetting/SystemDrawer";
import { useDispatch } from "react-redux";
import { useAuthMaster } from "@/redux/auth/authReducer";
import { RETRIEVE_USER_REQUEST } from "@/redux/auth/authAction";
import { Search } from "lucide-react";
import { Modal } from "@mui/material";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { REQUEST_GET_APPLICATION } from "@/redux/home/homeAction";

import { useUIContext } from "@/context/BasicProviders";
import { SearchDropdown } from "../home/Home";

const Colors = tokens();

const Navbar = () => {
  const { matches } = useCustomTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const [issystemmenu, setIsSystemmenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch({ type: REQUEST_GET_APPLICATION });
  }, [dispatch]);
  const { applications } = useHomeMaster();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      if (searchText) setDropdownVisible(true);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) =>
      app.expert_name.toLowerCase().includes(debouncedSearchText.toLowerCase())
    );
  }, [debouncedSearchText, applications]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsSearchModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  const sideIcon = {
    marginRight: "0.8vh",
    fontSize: "1rem",
  };
  const { hndleSelecteuser, selectedUser } = useUIContext();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      dispatch({ type: RETRIEVE_USER_REQUEST });
    }
  }, [dispatch]);
  const { retrieveUser } = useAuthMaster();

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: Colors.white_color[100] }}>
      <Box
        sx={{
          display: "flex",
          padding: {
            xl: "2vh 10vh",
            md: "2.1vh 10vh",
            xs: "2.1vh 2vh",
            sm: "2.1vh 2vh",
          },
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
        }}
      >
        <MainLogoHeader />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
          }}
        >
          {isSmallScreen && (
            <IconButton
              onClick={handleToggleSidebar}
              sx={{ display: "block", marginRight: "-1rem" }}
            >
              <IoIosMenu />
            </IconButton>
          )}
          {!isSmallScreen && (
            <>
              {navData.map((item) => {
                let active = location.pathname === item.path
                if(item.name === "FileVault"){
                  const paths = location.pathname.split("/");
                  if(paths[1] === "files"){
                    active = true;
                  }
                }
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{
                      fontWeight: 500,
                      color:
                      active
                          ? Colors.blue_color[100]
                          : Colors.black_color[100],
                      borderBottom:
                      active
                          ? `2px solid ${Colors.blue_color[100]}`
                          : "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {React.createElement(
                        item.icon,
                        { style: sideIcon },
                        null
                      )}
                      {item.name}
                    </Box>
                  </Link>
                );
              })}

              <div className="relative flex mx-auto border rounded-full border-gray-300 p-1 gap-2 mt-1 lg:w-1/2 max-w-[1400px]">
                <Modal
                  open={isSearchModalOpen}
                  style={{
                    paddingTop: "100px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div
                    className="relative flex mx-auto w-3/5 border rounded-full border-gray-200 p-3 gap-2 lg:w-1/2 max-w-[1400px]"
                    ref={dropdownRef}
                  >
                    <div className="flex items-center ">
                      <Search color="white " className="gap-1" />
                    </div>
                    <input
                      placeholder="Search Expert"
                      className=" w-full outline-none bg-black bg-opacity-5 text-white "
                      value={searchText}
                      onFocus={() => {
                        setDropdownVisible(true);
                      }}
                      onChange={handleChange}
                    ></input>
                    <div className="flex items-center"></div>
                    {dropdownVisible && (
                      <SearchDropdown
                        results={filteredApplications}
                        closeDropdown={() => {
                          setDropdownVisible(false);
                          handleCloseSearchModal();
                          setSearchText("");
                        }}
                        setIsSearchModalOpen={setIsSearchModalOpen}
                      />
                    )}
                  </div>
                </Modal>
                <div className="flex" onClick={handleOpenSearchModal}>
                  <div className="flex items-center">
                    <Search size={16} className="m-1" />
                  </div>
                  <input
                    placeholder="Search "
                    className="outline-none max-w-25 bg-white ml-1"
                  ></input>
                </div>
                <div className="flex items-center"></div>
              </div>
            </>
          )}
          <MobileMenu open={isSidebarOpen} onLinkClick={handleLinkClick} />

          <Box sx={{ borderLeft: "2px solid #ccc" }}>
            <Box
              sx={{
                marginLeft: "2vh",
                display: "flex",
                gap: 2,
                fontSize: "1.5rem",
                alignItems: "center",
              }}
            >
              {retrieveUser.roles && retrieveUser.roles.includes("admin") ? (
                matches ? (
                  <MdSettingsSuggest
                    style={{
                      color:
                        location.pathname === "/settings/general"
                          ? Colors.blue_color[100]
                          : Colors.black_color[100],
                    }}
                    fontSize="inherit"
                    onClick={() => {
                      setIsSystemmenu(!issystemmenu);
                    }}
                  />
                ) : (
                  <Link to="/settings/general">
                    <MdSettingsSuggest
                      style={{
                        color: location.pathname.includes("settings")
                          ? Colors.blue_color[100]
                          : Colors.black_color[100],
                      }}
                      fontSize="inherit"
                    />
                  </Link>
                )
              ) : null}

              {/* <Notification /> */}
              <LoginUser retrieveUser={retrieveUser} />
              <SystemDrawer
                issystemmenu={issystemmenu}
                handleclose={() => setIsSystemmenu(!issystemmenu)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
