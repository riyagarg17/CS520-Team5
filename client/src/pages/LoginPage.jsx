import React, { useState } from "react";
import { Form, Input, Button, Select, notification, Spin } from "antd";
import { LockOutlined, MailOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { ENDPOINTS } from "../api/endpoint";
import { useUserContext } from "../context/UserContext";
import Lottie from "lottie-react";
import doctorAnimation from "../assets/doctor-lottie.json";
import logo from "../assets/logo.png";
import "../styles/LoginPage.css";
import MFAVerification from "../components/MFAVerification";

const LoginPage = () => {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [showMFA, setShowMFA] = useState(false);
    const [email, setEmail] = useState("");
    const [tempToken, setTempToken] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUserContext();
    const location = useLocation();

    const handleRoleChange = (value) => {
        setRole(value);
    };

    const onFinish = (values) => {
        setLoading(true);
        const { password, email } = values;
        const params = new URLSearchParams(location.search);
        const isTesting = params.has("test");
        const loginUrl =
            role === "patient" ? ENDPOINTS.patientLogin : ENDPOINTS.doctorLogin;
        
        console.log("login url: ", loginUrl);
        fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password, email }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status_code === 401) {
                    notification.error({
                        message: "Login Failed",
                        description: data.detail || "Invalid credentials",
                        duration: 3,
                    });
                } else if (data.requiresMFA) {
                    console.log('MFA required, showing verification screen');
                    setEmail(email);
                    setTempToken(data.tempToken);
                    setShowMFA(true);
                } else {
                    notification.success({
                        message: "Login Successful",
                        description: `Welcome, ${
                            role.charAt(0).toUpperCase() + role.slice(1)
                        }!`,
                        duration: 3,
                    });
                    setUser({ ...data.body, type: role });
                    if (isTesting) {
                        navigate(role === "doctor" ? "/doctor" : "/patient");
                    } else {
                        navigate(role === "doctor" ? "/doctor" : "/patient");
                    }
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                notification.error({
                    message: "Login Failed",
                    description: "Please try again later.",
                    duration: 3,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleMFAComplete = (userData) => {
        console.log('MFA verification complete, navigating to dashboard');
        setUser({ ...userData, type: role });
        navigate(role === "doctor" ? "/doctor" : "/patient");
    };

    if (showMFA) {
        return <MFAVerification email={email} onComplete={handleMFAComplete} tempToken={tempToken} />;
    }

    return (
        <div className="login-container"
        style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '400px 20px 80px 20px' }}>
            <div className="floating-shape shape1"></div>
            <div className="floating-shape shape2"></div>

            <div className="login-card">
                <Lottie animationData={doctorAnimation} loop={true} className="login-lottie" />
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to manage your health dashboard</p>
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="role"
                        label="Select Role"
                        rules={[{ required: true, message: "Please select your role!" }]}
                    >
                        <Select
                            id="select-role"
                            placeholder="Select your role"
                            onChange={handleRoleChange}
                            value={role}
                        >
                            <Select.Option id="doctor" value="doctor">
                                Doctor
                            </Select.Option>
                            <Select.Option id="patient" value="patient">
                                Patient
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: "Please input your email!" }, { type: "email", message: "Please input a valid email!" }]}
                    >
                        <Input
                            id="login_email"
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password
                            id="login_password"
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                            style={{ 
                                background: '#1890ff',
                                height: '40px',
                                fontSize: '16px',
                                marginBottom: 16
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            type="link"
                            block
                            onClick={() => navigate("/register")}
                            style={{ 
                                fontSize: '14px'
                            }}
                        >
                            Don't have an account? Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
