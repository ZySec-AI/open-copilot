import { Button, Box, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { easeInOut } from "framer-motion";

const Colors = tokens();
export const useCustomTheme = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const Colors = tokens(theme.palette.mode);
    return { theme, matches, Colors };
};

export const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1
});

//custome save ,add blue button css
export const Customeuploadbutton = styled(Button)({
    backgroundColor: Colors.blue_color[100],
    color: Colors.white_color[100],
    border: `1px solid ${Colors.blue_color[100]}`,
    textTransform: "capitalize",
    height: "2.5rem",
    fontSize: "1rem",
    textWrap: "nowrap",
    borderRadius: "8px",
    "&:hover": {
        backgroundColor: Colors.white_color[200],
        color: Colors.blue_color[100],
        border: `1px solid ${Colors.blue_color[100]}`
    }
});
export const Customviewbutton = styled(Button)({
    backgroundColor: Colors.blue_color[100],
    color: Colors.white_color[100],
    border: `1px solid ${Colors.blue_color[100]}`,
    textTransform: "capitalize",
    height: "2rem",
    margin: "auto",
    fontSize: "1rem",
    textWrap: "nowrap",
    "&:hover": {
        backgroundColor: Colors.white_color[200],
        color: Colors.blue_color[100],
        border: `1px solid ${Colors.blue_color[100]}`
    }
});

//custome content preview button
export const Customepreviewbutton = styled(Button)({
    backgroundColor: Colors.blue_color[100],
    color: Colors.white_color[100],
    textTransform: "capitalize",
    height: "2rem",
    width: "6rem",
    borderRadius: "18px",
    "&:hover": {
        backgroundColor: Colors.blue_color[100],
        color: Colors.white_color[100]
    }
});

//custome content draft button
export const Customedraftbutton = styled(Button)({
    color: Colors.grey_color[100],
    backgroundColor: Colors.white_color[100],
    borderRadius: "18px",
    border: "1px solid #CCD4DE",
    textTransform: "capitalize",
    padding: "1rem",
    height: "2rem",
    marginLeft: "1rem",
    gap: "0.1rem",
    "&:hover": {
        color: Colors.grey_color[100],
        backgroundColor: Colors.white_color[100],
        border: "1px solid #CCD4DE",
        borderRadius: "18px"
    }
});

//custome edit upload cancel button
export const CustomeWhitebutton = styled(Button)({
    color: Colors.black_color[100],
    backgroundColor: Colors.white_color[100],
    borderRadius: "8px",
    border: "1px solid #CCD4DE",
    textTransform: "capitalize",
    padding: "1rem",
    height: "2.5rem",

    "&:hover": {
        color: Colors.black_color[100],
        backgroundColor: Colors.white_color[100]
    }
});

//Modal design
export const Modalstyle = styled("div")(() => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: Colors.white_color[100],
    borderRadius: "12px",
    transition: "transform 0.5s ease-in-out",
    "&.modal-enter": {
        transform: "translate(-150%, -50%)" // Adjust the left side position for enter transition
    },
    "&.modal-enter-active": {
        transform: "translate(-50%, -50%)" // Set the final left side position after enter transition
    }
}));

//remove red button
export const CustomremoveButton = styled(Button)({
    backgroundColor: Colors.white_color[100],
    color: Colors.error[100],
    border: `1px solid ${Colors.error[100]}`,
    height: "2rem",
    borderRadius: "0.5rem",
    "&:hover": {
        color: Colors.error[100],
        border: `1px solid ${Colors.error[100]}`,
        backgroundColor: Colors.white_color[100]
    }
});

export const LoginButton = styled(Button)({
    transition: "background-color 0.3s ease",
    width: "19rem",
    margin: "auto",
    display: "block",
    backgroundColor: Colors.blue_color[200],
    color: Colors.black_color[100],
    marginTop: "3rem",
    "&:hover": {
        backgroundColor: Colors.blue_color[200],
        color: Colors.black_color[100]
    }
});

export const Boxstyle = styled(Box)(({ theme }) => ({
    height: "85vh",
    width: "80vw",
    borderRadius: "12px",
    border: "1px solid #ccc",
    overflow: "auto",
    margin: "auto",
    backgroundColor: Colors.white_color[200],
    [theme.breakpoints.down("xl")]: {
        height: "82vh",
        width: "80vw"
    },
    [theme.breakpoints.down("lg")]: {
        height: "auto",
        width: "90vw"
    },
    [theme.breakpoints.only("sm")]: {
        height: "auto",
        width: "90vw"
    },
    [theme.breakpoints.only("md")]: {
        height: "auto",
        width: "93vw"
    }
}));

export const CommonBox = styled(Box)(() => ({
    border: "1px solid #ccc",
    margin: "2rem",
    padding: "1rem",
    borderRadius: "12px"
}));

export const Label = styled("label")({
    display: "block",
    fontSize: "1rem",
    fontWeight: 400,
    color: Colors.grey_color[100]
});

//custome light blue button
export const CustomStyledButton = styled(Button)({
    backgroundColor: Colors.white_color[100],
    color: Colors.black_color[100],
    textTransform: "capitalize",
    boxShadow: "none",
    fontSize: "1.1rem",
    "&:hover": {
        backgroundColor: Colors.white_color[100],
        color: Colors.black_color[100],
        boxShadow: "none"
    }
});

//cutome app store feature button
export const CustomFeaturesButton = styled(Button)({
    backgroundColor: Colors.blue_color[200],
    color: Colors.blue_color[100],
    textTransform: "capitalize",
    margin: "0.5rem",
    boxShadow: "none",
    fontSize: "0.8rem",
    gap: 9,
    "&:hover": {
        backgroundColor: Colors.blue_color[200],
        color: Colors.blue_color[100],
        boxShadow: "none"
    }
});
export const CustomsaveButton = styled(Button)({
    backgroundColor: Colors.blue_color[200],
    color: Colors.blue_color[100],
    textTransform: "capitalize",
    boxShadow: "none",
    borderRadius: "20rem",
    gap: "none",
    "&:hover": {
        backgroundColor: Colors.blue_color[200],
        color: Colors.blue_color[100],
        boxShadow: "none"
    }
});
export const DividerRoot = styled("div")(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    color: "#000",
    "& > :not(style) ~ :not(style)": {
        marginTop: theme.spacing(2)
    }
}));

export const CustomFileButon = styled(Button)({
  
    textTransform: "capitalize",
    fontSize: "1rem",
    padding:"0",
    color:"rgba(0,0,0,0.87) !important",
    fontWeight:"400"
});

export const CustomButtonPlaybook = styled(Button)({
    backgroundColor: Colors.blue_color[100],
    color: Colors.white_color[100],
    border: `1px solid ${Colors.blue_color[100]}`,
    textTransform: "capitalize",
    height: "2.5rem",
    fontSize: "1rem",
    textWrap: "nowrap",
    borderRadius: "8px",
    marginTop: "15px",
    "&:hover": {
        backgroundColor: Colors.white_color[200],
        color: Colors.blue_color[100],
        border: `1px solid ${Colors.blue_color[100]}`
    }
});


export const CustomChatEditButton = styled(Button)({
  
    textTransform: "capitalize",
    fontSize: "1rem",
    padding:"0",
    color:"rgba(0,0,0,0.87) !important",
    fontWeight:"400"
});