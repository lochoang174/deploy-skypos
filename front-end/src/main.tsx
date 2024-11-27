import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorBgSolid: "rgba(0, 0, 0, 0.88)",
                        colorPrimary: "rgba(0, 0, 0, 0.5)",
                        colorPrimaryHover: "rgba(0, 0, 0, 0.88)",
                        colorPrimaryActive: "rgba(0, 0, 0, 0.88)",
                        colorPrimaryTextHover: "rgba(0, 0, 0, 0.88)",
                        colorPrimaryTextActive: "rgba(0, 0, 0, 1)",
                        primaryShadow: "0 0 0 0 rgba(0, 0, 0, 0.5)",
                    },
                    Input: {
                        colorPrimaryHover: "rgba(0, 0, 0, 0.5)",
                        activeBorderColor: "rgba(0, 0, 0, 1)",
                        activeShadow: "0 0 0 0 rgba(0, 0, 0, 0.5)",
                    },
                },
            }}
        >
               <Provider store={store}>
      <App />
      </Provider>
        </ConfigProvider>
    </AuthProvider>
);
