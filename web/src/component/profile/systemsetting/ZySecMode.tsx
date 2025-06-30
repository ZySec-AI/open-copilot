import { useState } from "react";
import { Input } from "@/component/ui/input";
import { RadioGroup, RadioGroupItem } from "@/component/ui/radio-group";
import { Button } from "@/component/ui/button";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { UPDATE_SYSTEM_CONTROLS } from "@/redux/auth/authAction";

const Mode = ({ configDetails = null }) => {
  const [mode, setMode] = useState("private");
  const [baseUrl, setBaseUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [openAisecretKey, setOpenAiSecretKey] = useState("");
  const dispatch = useDispatch();
  const [buttonStyle, setButtonStyle] = useState({backgroundColor:"white",color:"black"});

  const handleChange = (mode: string) => {
    // const payload = {
    //     ...configDetails,
    //     "mode": mode,
    // }
    // dispatch({ type: UPDATE_SYSTEM_CONTROLS, payload });
    setMode(mode);
    setBaseUrl(baseUrl);
    setSecretKey(secretKey);
    setOpenAiSecretKey(openAisecretKey);
    setButtonStyle({backgroundColor: "black", color: "white"});
  };

  useEffect(() => {
    setMode(configDetails?.mode);
    setBaseUrl(configDetails?.private_base_url);
    setSecretKey(configDetails?.private_secret_key);
    setOpenAiSecretKey(configDetails?.private_open_ai_key);
  }, [configDetails]);

  const [errors, setErrors] = useState({ baseUrl: "", secretKey: "",openAisecretKey:'' });

  const handleUpdate = () => {
    if (mode === "Private" && (baseUrl === "" || secretKey === "")) {
      setErrors({
        baseUrl: baseUrl === "" ? "Base URL is required" : "",
        secretKey: secretKey === "" ? "Secret Key is required" : "",
        openAisecretKey: openAisecretKey === "" ? "Open ai Key is required" : "",
      });
    } else if (mode === "OpenAI" && openAisecretKey==="")  {
      setErrors({
        ...errors,
        openAisecretKey: openAisecretKey === "" ? "Open ai Key is required" : "",
      });
    } else {
      const payload = {
        ...(configDetails || {}),
        mode: mode,
        private_base_url: baseUrl,
        private_secret_key: secretKey, 
        private_open_ai_key: openAisecretKey,
      };
      dispatch({ type: UPDATE_SYSTEM_CONTROLS, payload });
      setMode(mode);
      setBaseUrl(baseUrl);
      setSecretKey(secretKey);
      setOpenAiSecretKey(openAisecretKey);
      setErrors({ baseUrl: "", secretKey: "" , openAisecretKey: ""});
      setButtonStyle({backgroundColor:"white",color:"black"});
    }
  };

  return (
    <div className="space-y-4 w-full ">
      {/* Top Bar with Update Button */}
      <div className="flex items-center justify-between align-middle">
        <div className="text-xl font-bold">Select Mode</div>
        <Button variant="outline" style={buttonStyle} onClick={handleUpdate}>
  Update
</Button>
      </div>

      <RadioGroup
        className="flex flex-col space-y-4"
        value={mode}
        onValueChange={handleChange}
      >
        {/* Mode Selection */}
        <div className="flex justify-between flex-col md:flex-row align-middle">
          <div>
            Private Mode
            <div className="font-sans text-muted-foreground">
              Private Mode is for running on your own GPU instance or in a
              private cloud deployment with an OpenAI-compatible API.
            </div>
          </div>
          <div>
            <RadioGroupItem value="Private" />
          </div>
        </div>

        {/* BaseUrl and Secret Key for Private Mode */}
        {mode === "Private" && (
          <>
          <div className="m-1">
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
            <div style={{ color: errors.baseUrl ? "red" : "transparent" }}>
              {errors.baseUrl || "placeholder"}
            </div>
            </div>
            <div className="m-1">
              <Input
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                type="password"
              />
              <div style={{ color: errors.secretKey ? "red" : "transparent" }}>
                {errors.secretKey || "placeholder"}
              </div>
            </div>
          </>
        )}

        {/* ZySec Demo Mode */}
        <div className="flex justify-between flex-col align-middle md:flex-row">
          <div>
            ZySec Demo Mode
            <div className="font-sans text-muted-foreground">
              ZySec Demo Mode is designed for users who prefer to use ZySec's
              resources without setup.
            </div>
          </div>
          <div>
            <RadioGroupItem value="zysec-demo" />
          </div>
        </div>

        {/* OpenAI Mode with Secret Key */}
        <div className="flex justify-between flex-col align-middle md:flex-row">
          <div>
            OpenAI Mode
            <div className="font-sans text-muted-foreground">
              OpenAI Mode leverages OpenAI's Large Language Models (LLM) to
              integrate with OpenAI's AI capabilities.
            </div>
          </div>
          <div>
            <RadioGroupItem value="OpenAI" />
          </div>
        </div>

        {/* Secret Key for OpenAI Mode */}
        {mode === "OpenAI" && (
          <>
            <div className="m-1">
              <Input
                label="Open Ai Key"
                value={openAisecretKey}
                onChange={(e) => setOpenAiSecretKey(e.target.value)}
                type="password"
                sx={{
                  "@media (max-width: 600px)": {
                    width: "100%",
                  },
                }}
              />
              <div style={{ color: errors.openAisecretKey ? "red" : "transparent" }}>
                {errors.openAisecretKey || "placeholder"}
              </div>
            </div>
          </>
        )}
      </RadioGroup>
    </div>
  );
};

export default Mode;
