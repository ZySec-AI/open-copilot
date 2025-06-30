import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import ReactMarkdown from "react-markdown";
import { CircleX } from "lucide-react";
import { CircularProgress } from "@mui/material";

const Blog = ({
  value,
  deleteContent,
}: {  
  value: any;
  deleteContent: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="max-w-[1200px] border border-gray-300 p-3 rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-lg min-h-[230px] flex flex-col justify-between cursor-pointer"
      style={{
        backgroundColor: "#f3f4f6",
        margin: "5px",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between ">
          <h2
            className="text-[#0D60D8] font-semibold "
            style={{ fontSize: "20px" }}
          >
            {value?.name
              ? value?.name
                  .split("")
                  .slice(0, 25)
                  .join("")
                  .concat(value?.name.length > 20 ? "..." : "")
              : "Untitled."}
          </h2>
          {isHovered && (
            <CircleX
              style={{
                fontSize: "1.5rem",
                color: "red",
                cursor: "pointer",
                position: "absolute",
              }}
              className="top-3 right-3 hover:scale-110 "
              onClick={() => deleteContent(value.id)}
            />
          )}
        </div>
        <div>
          <div className="text-sm min-w-72 ">
            <ReactMarkdown className="min-h-10">
              {value?.description
                ? value?.description
                    .split("")
                    .slice(0, 80)
                    .join("")
                    .concat(value?.description.length > 30 ? "..." : "")
                : "No description available."}
            </ReactMarkdown>
          </div>

          <div className="mt-4 ">
            {value.tags.map((item: any, index: any) => (
              <span
                key={index}
                className="inline-block bg-blue-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2"
              >
                {item.startsWith("#") ? <>{item}</> : <>#{item}</>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t pt-3">
        <span className="text-sm">
          {value.updated_at
            ? new Date(value.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"}
        </span>
        <span>
          <Link
            to={`/Create-Content/${value.id}`}
            className="text-[#0D60D8] hover:text-[#0d32d8] font-semibold transition-colors float-end"
          >
            Read More
          </Link>
        </span>
      </div>
    </div>
  );
};

const ContentBlog = ({
  playbookData,
  contentLoading,
  searchTerm,
  fetchContent,
}: {
  playbookData: any[];
  contentLoading: any;
  searchTerm: string;
  fetchContent: () => void;
}) => {
  const [displayCount, setDisplayCount] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setDisplayCount((prevCount) => prevCount + 9);
      }, 1000);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const deleteContent = async (id: string) => {
    // await dispatch(deletePlaybook(id));
  };

  const filteredData = playbookData.filter((playbook) =>
    playbook.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center mt-10">
      <div
        ref={containerRef}
        className="flex p-6 h-auto mainContent max-w-[1100px]"
        style={{
          height: "max-content",
          overflowY: "auto",
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6"
          style={{ width: "100%" }}
        >
          {contentLoading === "loading" ? (
            <CircularProgress size={20} style={{ color: "black" }} />
          ) : filteredData && filteredData.length > 0 ? (
            filteredData.slice(0, displayCount).map((value, index) => (
              <div key={index}>
                <Blog value={value} deleteContent={deleteContent} />
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
      {isLoading && <CircularProgress size={20} style={{ color: "black" }} />}
    </div>
  );
};

export default ContentBlog;
