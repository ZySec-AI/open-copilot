import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import Basicprovider from "./context/BasicProviders";
import { Provider } from "react-redux";
import store from "./redux/store";

const theme = createTheme({
    typography: {
        fontFamily: "Poppins, sans-serif"
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "Poppins, sans-serif", // Font family for Button
                    cursor: "pointer "
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: "Poppins, sans-serif" // Font family for Typography
                }
            }
        },
        MuiBox: {
            styleOverrides: {
                root: {
                    fontFamily: "Poppins, sans-serif" // Font family for Typography
                }
            }
        }
    }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <Basicprovider>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </Basicprovider>
    </Provider>
);

reportWebVitals();
