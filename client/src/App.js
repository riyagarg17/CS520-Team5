import React, { useState } from "react";
import 'antd/dist/reset.css';
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import { Layout } from "antd";
import Navbar from "../../client/src/components/Navbar";
import LoginPage from "../../client/src/pages/LoginPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserProvider } from "./context/UserContext";
import RegistrationPage from "./pages/Registration";
import PatientPage from "./pages/PatientPage";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import ViewAppointments from "./pages/PatientAppointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorDashboard from "./pages/DoctorDashboard";
import HealthPage from "./pages/PatientDashboard";
import Chatbot from "./pages/Chatbot";

const { Content } = Layout;

// Main App component: Sets up the application layout, routing, and user context.
const App = () => {
    const [selectedKey, setSelectedKey] = useState("1"); // Manages the selected key for the Navbar, though not directly used in this simplified version for routing logic.

    return (
        // UserProvider wraps the application to provide user context (like login state) to all components.
        <UserProvider>
            {/* Router handles client-side navigation. */}
            <Router>
                <Layout>
                    {/* Navbar component displayed on all pages. */}
                    <Navbar selectedKey={selectedKey} />
                    {/* Content area for displaying page components based on the current route. */}
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
                                {/* Routes define the mapping between URL paths and React components. */}
                                <Routes>
                                    {/* Default route redirects to /login. */}
                                    <Route path="/" element={<Navigate to="/login" replace />} />{" "}
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegistrationPage />} />
                                    {/* Patient-specific routes. */}
                                    <Route path="/patient" element={<PatientPage />} />
                                    <Route path="/schedule" element={<ScheduleAppointment />} />
                                    <Route path="/patient/appointments" element={<ViewAppointments />} />
                                    <Route path="/patient/dashboard" element={<HealthPage />} />
                                    {/* Doctor-specific routes. */}
                                    <Route path="/doctor" element={<DoctorDashboard />} />
                                    <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                                    {/* Shared route for chatbot. */}
                                    <Route path="/chatassist" element={<Chatbot />} />
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