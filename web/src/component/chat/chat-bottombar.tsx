import React, { useRef, useState, useEffect, useMemo } from "react";
import { SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Message, UserData, UserDataType } from "@/component/data/Mockdata";
import { useDispatch } from "react-redux";
import { PROMPT_CHAT_REQUEST } from "@/redux/chat/chatAction";
import { useChatMaster } from "@/redux/chat/chatReducer";
import { useUIContext } from "@/context/BasicProviders";
import ChatExpertModal from "../modal/ChatExpertModal";
import { Button } from "flowbite-react";
import { FaUserGroup } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { REQUEST_GET_APPLICATION } from "@/redux/home/homeAction";
import { useHomeMaster } from "@/redux/home/homeReducer";
import { createEditor, Transforms } from "slate";
import { withReact } from "slate-react";
import { Textarea } from "../ui/textarea";
import { useGetCategoriesQuery } from "@/redux/folder/folderSlice";
import { API_URL } from "@/constant/config";

interface ChatBottombarProps {
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
  selectedUser: UserDataType;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  showStaticQuestions: boolean;
  categories?:string;
}
const withSingleLine = (editor:any) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]:any) => {
    if (path.length === 0) {
      if (editor.children.length > 1) {
        Transforms.mergeNodes(editor);
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

export default function ChatBottombar({
  sendMessage,
  selectedUser,
  message,
  setMessage,
  showStaticQuestions,
}: ChatBottombarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [startQuestions, setStartQuestions] = useState<string[]>([]);

  const dispatch = useDispatch();
  const { applications } = useHomeMaster();
  const { setShouldReload, setChatIds } = useUIContext();
  const { chatId } = useChatMaster();
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [expertModal, setExpertModal] = useState(false);
  const [showExpertList, setShowExpertList] = useState(false);
  const [filteredExperts, setFilteredExperts] = useState(applications);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const location = useLocation();
  const { fileId } = location.state || {};
  const editor = useMemo(() => withSingleLine(withReact(createEditor())), []);
  const { data: categoryData } = useGetCategoriesQuery();


  useEffect(() => {
    dispatch({ type: REQUEST_GET_APPLICATION });
  }, [dispatch]);

  useEffect(() => {
    setFilteredExperts(applications);
  }, [applications]);

  useEffect(() => {
    if (selectedCategory) {
      setErrorMessage(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedUser?.start_questions) {
      setStartQuestions(selectedUser?.start_questions);
    } else {
      setStartQuestions([
        "What can I assist you with today?",
        "Do you have any questions?",
        "How can I make your day better?",
      ]);
    }
  }, [selectedUser]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setMessage(value);
    if (value.includes("@")) {
      setShowExpertList(true);
      const query = value.split("@").pop();
      setFilteredExperts(
        applications.filter((app:any) =>
          app.expert_name.toLowerCase().includes(query?.toLowerCase())
        )
      );
    } else {
      setShowExpertList(false);
    }
    setIsQuestionActive(!!value.trim());
  };

  const handleSend = (
    _: any = null,
    isStaticQuestion: boolean = false,
    question: string = ""
  ) => {
    if (!selectedCategory && selectedUser?.type === "category" && selectedUser?.categories?.includes("*")) {
      setErrorMessage("Please select a category before sending a message.");
      return;
    }
    const newQuestion = isStaticQuestion ? question : message;
    if (newQuestion.trim()) {
      const newMessage: Message = {
        message: newQuestion.trim(),
        bot: "",
      };
      sendMessage(newMessage);
      setMessage("");
      setStartQuestions([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    let UserMessage = newQuestion;
    applications.forEach((item: any) => {
      UserMessage = UserMessage.replace(
        "@" + item.expert_name + "",
        "@" + item.id + "  "
      );
    });
    const chatIdField = !chatId ? { chat_id: "" } : { chat_id: chatId };
    const messageData = {
      messages: [{ content: UserMessage, role: "user" }],
      files: [fileId ? fileId : "*"],
      category_id: selectedCategoryId,
      expert_id: selectedUser.id,
      ...chatIdField,
      appDetails: {
        version: "1.0.0",
        addition_field: "addition_field",
      },
    };
    const newMessgaedata = { message: newQuestion, payloadData: messageData };
    dispatch({ type: PROMPT_CHAT_REQUEST, payload: newMessgaedata });
    setShouldReload((pre: any) => !pre);
    setChatIds(chatId);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
      setStartQuestions([]);
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev: string) => prev + "\n");
      setStartQuestions([]);

    }
  };

  const handleExpertSelect = (expert: { id: string; expert_name: string }) => {
    setMessage((prev) => prev.replace(/@\w*$/, `@${expert.expert_name} `));
    setShowExpertList(false);
    inputRef.current?.focus();
  };

  const handleCategoryClick = (categoryName: any, categoryId: any) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
    setShowCategoryList(false);
  };

  const handleQuestionClick = (question: string) => {
    handleSend("", true, question);
    setStartQuestions([]);
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative m-3"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <div className="flex flex-wrap ml-12 mr-3">
            {showStaticQuestions
              ? startQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="m-2 p-2 bg-blue-100 rounded-md text-black overflow-ellipsis overflow-hidden w-[48%]"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </div>
                ))
              : null}
          </div>

          {showCategoryList && (
            <div className="flex flex-wrap ml-12">
              {selectedUser?.type === "category" &&
                selectedUser?.categories?.includes("*") &&
                categoryData?.map((category, index) => (
                  <div
                    key={index}
                    className=" flex justify-center m-2 p-2 bg-blue-100 rounded-md text-black overflow-ellipsis overflow-hidden w-[30%]"
                    onClick={() =>
                      handleCategoryClick(category?.name, category.id)
                    }
                  >
                    {category?.name}
                  </div>
                ))}
            </div>
          )}

          {selectedUser?.type === "category" &&
            selectedUser?.categories?.includes("*") && (
              <Button
                className="left-3 m-3 commanbtn items-center"
                onClick={() => setShowCategoryList((prev) => !prev)}
              >
                <FaUserGroup className="m-1" />
                Select Category
              </Button>
            )}

          {selectedUser?.type === "category" && selectedCategory && (
            <p className="ml-7 ">
              Now you're chatting with {""}
              <span className="font-semibold">{selectedCategory}</span>
            </p>
          )}

          {selectedUser?.type === "category" &&
            selectedUser?.categories?.includes("*") && errorMessage && (
              <div className="p-2 flex justify-between w-full items-center gap-2">
                <div className="text-red-500">{errorMessage}</div>
              </div>
            )}

          <div className="p-2 flex justify-between w-[97%] items-center gap-2">
            <Textarea
              autoComplete="off"
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="search here.."
              className=" w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
            ></Textarea>
          </div>
          <div className="absolute right-3 bottom-2">
            <SendHorizontal
              onClick={handleSend}
              className="h-5 w-5 mb-2 mr-11"
            />
          </div>
          <div className="ml-[8vw]">
            {showExpertList && (
              <ExpertList
                experts={filteredExperts}
                onSelect={handleExpertSelect}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface ExpertListProps {
  experts: { id: string; expert_name: string; avatar: string }[];
  onSelect: (expert: { id: string; expert_name: string }) => void;
}

const ExpertList: React.FC<ExpertListProps> = ({ experts, onSelect }) => {
  return (
    <div className="absolute bottom-full mb-1 bg-white rounded-lg shadow-lg ">
      {experts.map((expert) => (
        <div
          key={expert.id}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(expert)}
        >
          <div className="flex items-center">
            <img
              src={`${API_URL}/${expert.avatar}`}
              id="new"
              alt={expert.avatar}
              className="w-6 h-6 mr-1 border rounded-full"
            />
            {expert.expert_name}
          </div>
        </div>
      ))}
    </div>
  );
};
