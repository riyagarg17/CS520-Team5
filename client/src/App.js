import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation
} from "react-router-dom";
import { Layout } from "antd";
import Navbar from "../../client/src/components/Navbar";
import LoginPage from "../../client/src/pages/LoginPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserProvider } from "./context/UserContext";
import RegistrationPage from "./pages/Registration";

const { Content } = Layout;

const App = () => {
    const [selectedKey, setSelectedKey] = useState("1");

    return (
        <UserProvider>
            <Router>
                <Layout>
                    <Navbar selectedKey={selectedKey} />
                    <Content style={{ padding: "0 48 px" }}>
                        <div
                            style={{
                                minHeight: 280,
                                height: "100%",
                                padding: 24,
                                margin: 40,
                                background: "white",
                                borderRadius: 10,
                            }}
                        >
                            <div style={{ padding: "10px", display: "grid" }}>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/login" replace />} />{" "}
                                    /*<Route path="/login" element={<LoginPage />} />*/
                                    <Route path="/register" element={<RegistrationPage />} />
                                </Routes>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Router>
        </UserProvider>
    );
};

export default App;