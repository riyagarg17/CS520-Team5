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

const LoginPage = () => {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
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
        
        console.log("login url: ", loginUrl)
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
                        // navigate(`/mfa/register`); 
                        // Ansh to implement this; only if not testing, uncomment later
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

    return (
        <div className="login-container">
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
                            id="login-button"
                            type="primary"
                            htmlType="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? <Spin indicator={<LoadingOutlined spin />} /> : "Log In"}
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                        <Button
                            type="link"
                            id="register-link"
                            onClick={() => navigate("/register")}
                            className="register-link"
                        >
                            Don't have an account yet? Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
