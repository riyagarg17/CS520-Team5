import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation
} from "react-router-dom";
import { Layout } from "antd";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import PaymentPage from "./pages/PaymentPage";
import DoctorPage from "./pages/DoctorPage";
import MapViewPage from "./pages/MapViewPage";
import ChatAssistancePage from "./pages/ChatAssistancePage";
import PatientPage from "./pages/PatientPage";
import LocationSearch from "./components/Maps/LocationSearch";
import LoginPage from "./pages/LoginPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import Directions from "./components/Maps/Directions";
import AddressSelector from "./components/Maps/AddressSelector";
import { UserProvider } from "./context/UserContext";
import RegistrationPage from "./pages/Registration";
import OtpRegistration from "./components/MFA/OtpRegistration";

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
                                    {/* FIXME: Change this to login*/}
                                    <Route path="/register" element={<RegistrationPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/patient" element={<PatientPage />} />
                                    <Route path="/doctor" element={<DoctorPage />} />
                                    <Route path="/mapview/*" element={<MapViewPage />}>
                                        <Route index element={<LocationSearch />} />
                                        <Route
                                            path="location-search"
                                            element={<LocationSearch />}
                                        />
                                        <Route path="directions" element={<Directions />} />
                                    </Route>
                                    <Route path="/chatassist" element={<ChatAssistancePage />} />
                                    <Route path="/payment" element={<PaymentPage />} />
                                    <Route path="/test" element={<LocationSearch />} />
                                    <Route path="/location" element={<AddressSelector />} />
                                    <Route path="/mfa/register" element={<OtpRegistration />} />
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