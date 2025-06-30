import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VscPreview } from "react-icons/vsc";
import { MdEdit } from "react-icons/md";
import Box from "@mui/material/Box";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "react-markdown-editor-lite/lib/index.css";
import { useAppDispatch } from "@/hook";
import { CircularProgress } from "@mui/material";
import { any } from "zod";

const CreateContent = () => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [playbook, setPlaybook] = useState<any>(null);
  const [initialDec, setInitialDec] = useState("");

  useEffect(() => {
    setPlaybook(playbook);
    setInitialDec(playbook?.content ?? "");
  }, [id, dispatch]);

  const [name, setName] = useState(playbook?.name ?? "");
  const [description, setDescription] = useState(playbook?.description ?? "");


  const handleContentChange = ({ text }: { text: string }) => {
    if (playbook) {
      setPlaybook({ ...playbook, content: text });
    }
  };

  const saveContent = () => {
    setIsEditMode(false);
    if (playbook) {
      const data = {
        name: name,
        tags: playbook.tags,
        content: playbook.content,
        category: playbook.category?.name,
        content_type: playbook.content_type,
        id: id,
        description: description,
      };
      setPlaybook(data);
    }
  };

  function getLastEditedText(updatedAt: string) {
    const currentTime = new Date();
    const updatedTime = new Date(updatedAt);
    const timeDifferenceInMilliseconds = currentTime.getTime() - updatedTime.getTime();
    const timeDifferenceInHours = Math.floor(
      timeDifferenceInMilliseconds / (1000 * 60 * 60)
    );

    let lastUpdatedText;
    if (timeDifferenceInHours < 24) {
      const timeDifferenceInMinutes = Math.floor(
        timeDifferenceInMilliseconds / (1000 * 60)
      );
      lastUpdatedText = `Last updated ${
        timeDifferenceInMinutes < 60 ? timeDifferenceInMinutes : Math.floor(timeDifferenceInHours)
      } ${timeDifferenceInMinutes < 60 ? "minute" : "hour"}${
        timeDifferenceInMinutes === 1 ? "" : "s"
      } ago`;
    } else {
      const options = { year: "numeric", month: "short", day: "numeric" };
      // lastUpdatedText = `Last updated on ${updatedTime.toLocaleDateString(undefined, options)}`;
    }
    return lastUpdatedText;
  }

  return (
    <div className="bg-white rounded-lg h-screen">
      <div className="flex gap-4 mx-5 my-3">
        <div className="flex flex-row justify-between w-full item-center mt-2">
          <div>
            <h2 className="text-xl font-bold">
              {isEditMode ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded w-[25vw] px-2 m-1 text-grey-darker"
                />
              ) : (
                playbook.name
              )}
            </h2>
            <div className="text-sm font-semibold">
              {isEditMode ? (
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border rounded w-[30vw] px-2 m-1 text-grey-darker"
                />
              ) : playbook.description && playbook.description.length > 30 ? (
                playbook.description.substring(0, 50) + "..."
              ) : (
                playbook.description
              )}
            </div>
            {playbook.created_by && (
              <p className="text-gray-400">
                {getLastEditedText(playbook.updated_at)} by{" "}
                <span className="text-blue-500">
                  {playbook.created_by.full_name}
                </span>
              </p>
            )}
          </div>
          {playbook.content_type === "playbooks" && (
            <div className="items-center flex space-x-4 animate-slide-in-right">
              {isEditMode ? (
                <div className="flex">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 mx-4 rounded-md flex items-center transform transition duration-500 hover:scale-110"
                    onClick={saveContent}
                  >
                    <VscPreview className="mr-2" />
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className="bg-blue-500 text-white py-2 px-4 mx-4 rounded-md flex items-center p-5 transform transition duration-500 hover:scale-110"
                  onClick={() => setIsEditMode(true)}
                >
                  <MdEdit className="mr-2" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 overflow-auto h-full bg-blue-100 rounded-lg shadow-lg">
        {isEditMode ? (
          <MdEditor
            value={playbook.content || ""}
            style={{ height: 'calc(100vh - 200px)', width: '100%' }}
            renderHTML={(text) => <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>}
            onChange={handleContentChange}
          />
        ) : (
          <div className="prose w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {playbook.content || ""}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateContent;
