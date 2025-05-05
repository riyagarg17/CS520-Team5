import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Radio,
    Typography,
    notification,
    Upload,
    Tooltip,
} from "antd";
import {
    UserOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    UploadOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

// Import the CSS file with the correct path
import "../styles/RegistrationPage.css";
import {
    registerDoctor,
    registerPatient,
} from "../api/services/registrationService";

const { Text } = Typography;

const RegistrationPage = () => {
    const [form] = Form.useForm();
    const [userType, setUserType] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState({
        minLength: false,
        capitalLetter: false,
        smallLetter: false,
        number: false,
        specialChar: false,
    });
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // State to track the button disabled status
    const [age, setAge] = useState(null);
    const { setUser } = useUserContext();
    const navigate = useNavigate();
    const [licenseFile, setLicenseFile] = useState(null);
    const location = useLocation();

    const allValid = Object.values(passwordValid).every(Boolean);

    const handleUserTypeChange = (value) => {
        setUserType(value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPasswordValid({
            minLength: value.length >= 8,
            capitalLetter: /[A-Z]/.test(value),
            smallLetter: /[a-z]/.test(value),
            number: /\d/.test(value),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        });
    };

    const preventPasswordActions = (e) => {
        e.preventDefault();
    };

    const onFinish = (values) => {
        let patientData = {};
        if (userType === "patient") {
            patientData = {
                email: values.email,
                name: values.name,
                dob: values.dob,
                gender: values.gender,
                password: values.password,
                pincode: values.pincode,
            };
            registerPatient(patientData)
                .then((data) => {
                    console.log("Backend response:", data); 
                    if (data.status_code === 400) {
                        notification.error({
                            message: "Registration Failed",
                            description: "This email is already registered",
                            duration: 3,
                        });
                    } else {
                        setUser({ ...data.body, type: userType });
                        navigate("/patient");
                        // navigate("/mfa/register"); Ansh needs to add this
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    notification.error({
                        message: "Registration Failed",
                        description: "Please try again later",
                        duration: 3,
                    });
                });
        }
        if (userType === "doctor") {
            registerDoctor(values, licenseFile)
                .then((data) => {
                    if (data.status_code === 400) {
                        notification.error({
                            message: "Registration Failed",
                            description: "This email is already registered",
                            duration: 0,
                            key: "registration-failed",
                        });
                    } else {
                        // notification.destroy("registration-failed");
                        notification.success({
                            message: "Registration Successful",
                            description: `Welcome Dr. ${data.body.name}!`,
                          });
                        setUser({ ...data.body, type: userType });
                        navigate("/doctor");
                        // navigate("/mfa/register"); Ansh to complete this 
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    notification.error({
                        message: "Registration Failed",
                        description: "Please try again later",
                        duration: 0,
                        key: "registration-failed",
                    });
                });
        }
    };

    const handleSwitchRole = () => {
        setUserType(userType === "doctor" ? "patient" : "doctor");
    };

    const isFormValid = () => {
        const fieldsValue = form.getFieldsValue();
        const confirmPassword = fieldsValue.confirm;
        const passwordMatch = password === confirmPassword;
        const allFieldsFilled = Object.values(fieldsValue).every(
            (value) => value !== undefined && value !== ""
        );
        return (
            passwordValid.minLength &&
            passwordValid.capitalLetter &&
            passwordValid.smallLetter &&
            passwordValid.number &&
            passwordValid.specialChar &&
            passwordMatch &&
            allFieldsFilled
        );
    };

    const handleFileChange = ({ file }) => {
        setLicenseFile(file);
    };

    const calculateMaxDate = () => {
        const today = new Date();
        return new Date(
            today.getFullYear() - 25,
            today.getMonth(),
            today.getDate()
        );
    };

    return (
        <div className="registration-container">
            <Form
                name="register"
                onFinish={onFinish}
                initialValues={{ remember: true }}
                className="registration-form"
                layout="vertical"
                onValuesChange={isFormValid}
            >
                <h2 className="registration-header">Register</h2>

                {!userType && (
                    <Form.Item
                        name="userType"
                        label="Register As"
                        rules={[
                            { required: true, message: "Please select your user type" },
                        ]}
                        className="form-item"
                    >
                        <div className="role-selection-buttons">
                            <Button
                                id="patient-button"
                                type={userType === "patient" ? "primary" : "default"}
                                onClick={() => handleUserTypeChange("patient")}
                                block
                            >
                                Patient
                            </Button>
                            <Button
                                id="doctor-button"
                                type={userType === "doctor" ? "primary" : "default"}
                                onClick={() => handleUserTypeChange("doctor")}
                                block
                            >
                                Doctor
                            </Button>
                        </div>
                    </Form.Item>
                )}

                {userType && (
                    <Form.Item className="form-item">
                        <Text
                            id="user-greeting"
                            type="secondary"
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                        >
                            You are registering as a{" "}
                            {userType.charAt(0).toUpperCase() + userType.slice(1)}
                        </Text>
                    </Form.Item>
                )}

                {userType && (
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: "Please input your name" }]}
                        className="form-item"
                    >
                        <Input id="name" prefix={<UserOutlined />} placeholder="Name" />
                    </Form.Item>
                )}

                {userType && (
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please input your email" },
                            { type: "email", message: "Please enter a valid email" },
                        ]}
                        className="form-item"
                    >
                        <Input id="email" prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>
                )}

                {userType && (
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Please input your password" }]}
                        hasFeedback
                        validateStatus={
                            passwordFocused ? (allValid ? "success" : "error") : ""
                        }
                        className="form-item"
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            id="password"
                            placeholder="Password"
                            iconRender={(visible) =>
                                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                            }
                            onChange={handlePasswordChange}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            onCut={preventPasswordActions}
                            onCopy={preventPasswordActions}
                            onPaste={preventPasswordActions}
                        />
                    </Form.Item>
                )}
                {allValid && (
                    <Form.Item className="form-item">
                        <span style={{ color: "green" }}>Password is strong!</span>
                    </Form.Item>
                )}

                {userType && (
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "Please confirm your password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject("The two passwords do not match");
                                },
                            }),
                        ]}
                        className="form-item"
                    >
                        <Input.Password
                            id="confirm-password"
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                            iconRender={(visible) =>
                                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                            }
                            onCut={preventPasswordActions}
                            onCopy={preventPasswordActions}
                            onPaste={preventPasswordActions}
                        />
                    </Form.Item>
                )}

                {passwordFocused && (
                    <Form.Item className="form-item">
                        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                            <li style={{ color: passwordValid.minLength ? "green" : "red" }}>
                                {passwordValid.minLength ? "✔️ " : "❌ "} Minimum 8 characters
                            </li>
                            <li
                                style={{
                                    color: passwordValid.capitalLetter ? "green" : "red",
                                }}
                            >
                                {passwordValid.capitalLetter ? "✔️ " : "❌ "} At least one
                                capital letter
                            </li>
                            <li
                                style={{ color: passwordValid.smallLetter ? "green" : "red" }}
                            >
                                {passwordValid.smallLetter ? "✔️ " : "❌ "} At least one small
                                letter
                            </li>
                            <li style={{ color: passwordValid.number ? "green" : "red" }}>
                                {passwordValid.number ? "✔️ " : "❌ "} At least one number
                            </li>
                            <li
                                style={{ color: passwordValid.specialChar ? "green" : "red" }}
                            >
                                {passwordValid.specialChar ? "✔️ " : "❌ "} At least one special
                                character
                            </li>
                        </ul>
                    </Form.Item>


                )}

                {userType === "doctor" && (
                    <>

                        {
                            <Form.Item
                                name="license"
                                label="Medical License"
                                id="license"
                                style={{ width: "100%" }}
                                valuePropName="fileList"
                                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please upload your Medical License as a PDF file",
                                    },
                                    {
                                        validator: (_, fileList) => {
                                            const file = fileList?.[0];
                                            if (file && file.type !== "application/pdf") {
                                                return Promise.reject("Please upload a PDF file");
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                                className="form-item"
                            >
                                <Upload
                                    name="license"
                                    id="license"
                                    accept=".pdf"
                                    beforeUpload={() => false} // Prevent automatic upload
                                    onChange={handleFileChange}
                                    fileList={licenseFile ? [licenseFile] : []}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </Form.Item>
                        }

                        <Form.Item
                            name="dob"
                            label={
                                <span>
                  Date of Birth&nbsp;
                                    <Tooltip title="Doctors must be at least 25 years old to register.">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
                            }
                            rules={[
                                { required: true, message: "Please input your date of birth" },
                            ]}
                            className="form-item"
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                disabledDate={(current) => {
                                    const maxDate = calculateMaxDate();
                                    return current && current.isAfter(maxDate);
                                }}
                                id="dob"
                            />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true, message: "Please select your gender" }]}
                            className="form-item"
                        >
                            <Radio.Group>
                                <Radio id="male" value="male">
                                    Male
                                </Radio>
                                <Radio id="female" value="female">
                                    Female
                                </Radio>
                                <Radio id="other" value="other">
                                    Other
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="exp"
                            label="Years of Experience"
                            rules={[{ required: true, message: "Please input your number of years of experience" }]}
                            className="form-item"
                        >
                            <Input id="exp" placeholder="0" />
                        </Form.Item>
                    </>
                )}

                {userType && (
                    <Form.Item
                        name="pincode"
                        label="Pincode"
                        rules={[
                            { required: true, message: "Please input your pincode" },
                            { pattern: /^[0-9]{6}$/, message: "Invalid pincode" },
                        ]}
                        className="form-item"
                    >
                        <Input id="pincode" placeholder="Pincode" />
                    </Form.Item>
                )}

                {userType === "patient" && (
                    <>
                        <Form.Item
                            name="dob"
                            label="Date of Birth"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your date of birth",
                                },
                            ]}
                            className="form-item"
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                disabledDate={(current) => current && current > new Date()}
                                id="dob"
                            />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true, message: "Please select your gender" }]}
                            className="form-item"
                        >
                            <Radio.Group>
                                <Radio id="malep" value="male">
                                    Male
                                </Radio>
                                <Radio id="femalep" value="female">
                                    Female
                                </Radio>
                                <Radio id="otherp" value="other">
                                    Other
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </>
                )}

                {userType && (
                    <Form.Item className="form-item">
                        <Button
                            type="primary"
                            style={{ width: "100%" }}
                            htmlType="submit"
                            className="registration-form-button"
                            id="register-button"
                            //disabled={isButtonDisabled}
                        >
                            Register
                        </Button>
                    </Form.Item>
                )}

                {userType && (
                    <Form.Item className="switch-role-button">
                        <Button id="switch-form" type="link" onClick={handleSwitchRole}>
                            {userType === "doctor"
                                ? "Not a doctor? Switch to Patient Registration"
                                : "Not a patient? Switch to Doctor Registration"}
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </div>
    );
};

export default RegistrationPage;