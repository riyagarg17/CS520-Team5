import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Select, notification } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { ENDPOINTS } from "../api/endpoint";
import { useUserContext } from "../context/UserContext";

const LoginPage = () => {
    const [role, setRole] = useState(""); // State to track the selected role
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const location = useLocation();

    // Handle the change in role selection
    const handleRoleChange = (value) => {
        setRole(value); // Update the selected role
    };

    // Handle form submission
    const onFinish = (values) => {
        const { password, email } = values;

        const params = new URLSearchParams(location.search);
        const isTesting = params.has("test");

        // Define the login URL based on the selected role
        const loginUrl =
            role === "patient" ? ENDPOINTS.patientLogin : ENDPOINTS.doctorLogin;

        // Post the username, password, and email to the respective API endpoint
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
                    // If an error is returned (like wrong credentials)
                    notification.error({
                        message: "Login Failed",
                        description: data.detail || "Invalid credentials",
                        duration: 3,
                    });
                } else {
                    // On successful login, navigate to the respective dashboard
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
                        navigate(`/mfa/register`);
                    }
                }
            })
            .catch((error) => {
                // If there's any error during the fetch call
                console.error("Error:", error);
                notification.error({
                    message: "Login Failed",
                    description: "Please try again later.",
                    duration: 3,
                });
            });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f0f2f5",
            }}
        >
            <Form
                name="login"
                onFinish={onFinish}
                style={{ maxWidth: 400, width: "100%" }}
                layout="vertical"
            >
                <h2 style={{ textAlign: "center" }}>Login</h2>

                {/* Dropdown to select role (Doctor or Patient) */}
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

                {/* Email Field */}
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please input a valid email!" },
                    ]}
                >
                    <Input
                        id="login_email"
                        prefix={<MailOutlined />}
                        placeholder="Email"
                    />
                </Form.Item>

                {/* Password Field */}
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
                        style={{ width: "100%" }}
                    >
                        Log In
                    </Button>
                </Form.Item>

                {/* Link to Registration Page */}
                <Form.Item style={{ textAlign: "center" }}>
                    <Button
                        type="link"
                        id="register-link"
                        onClick={() => navigate("/register")}
                        style={{ padding: 0, fontSize: "14px" }}
                    >
                        Don't have an account yet? Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;