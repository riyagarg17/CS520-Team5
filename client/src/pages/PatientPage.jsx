import React, { useState } from "react";
import "../styles/Patient.css";
import { Card, Col, Row, Typography, Button, Modal, Form, Input, InputNumber } from "antd";
import { CalendarOutlined, HeartOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Lottie from "lottie-react";
import patientAnimation from "../assets/patient-lottie.json";
import {useNavigate} from "react-router-dom";

const Patient = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);
    const { Title } = Typography;
    const handleFormSubmit = (values) => {
        console.log("Submitted health data:", values);
        setIsModalVisible(false);
    };
    return (
        <div className="patient-container">
            <h1 className="patient-header">👋 Welcome to CareCompass, Riya!</h1>
            <p className="patient-subtitle">Your personalized health dashboard</p>

            <div className="patient-cards">
                <Card
                    className="patient-card gradient-orange"
                    title="Add/Update Health Details"
                    extra={
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <PlusOutlined style={{ fontSize: 20, color: '#fff' }} />
                        </div>
                    }
                    headStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', borderBottom: 'none' }}
                >
                    <p className="card-text">Keep your health information up to date for accurate diagnostics.</p>
                    <Button type="default" className="card-button" onClick={showModal}>Update Now</Button>
                </Card>
                <Card
                    className="patient-card gradient-blue"
                    title="Your Appointments"
                    extra={<CalendarOutlined style={{ fontSize: 22, color: '#fff' }} />}
                    headStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', borderBottom: 'none' }}
                >
                    <p className="card-text">You have 2 upcoming appointments.</p>
                    <Button type="default" className="card-button" onClick={() => navigate("/viewAppointments")}>View Appointments</Button>
                </Card>

                <Card
                    className="patient-card gradient-green"
                    title="Schedule Appointment"
                    extra={<PlusOutlined style={{ fontSize: 22, color: '#fff' }} />}
                    headStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', borderBottom: 'none' }}
                >
                    <p className="card-text">Book an appointment with your preferred doctor.</p>
                    <Button type="default" className="card-button" onClick={() => navigate("/schedule")}>Schedule Now</Button>
                </Card>

                <Card
                    className="patient-card gradient-purple"
                    title="Health Overview"
                    extra={<HeartOutlined style={{ fontSize: 22, color: '#fff' }} />}
                    headStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', borderBottom: 'none' }}
                >
                    <p className="card-text">View your latest health metrics like BMI, glucose, BP, and more.</p>
                    <Button type="default" className="card-button" onClick={() => navigate("/patientDashboard")}>View Health Data</Button>
                </Card>
            </div>
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText="Save"
                className="fancy-modal"
            >
                <div className="modal-header">
                    <Lottie animationData={patientAnimation} style={{ width: 150, height: 150 }} />
                    <Title level={3}>Update Health Details</Title>
                </div>
                <Form layout="vertical" form={form} onFinish={handleFormSubmit} className="fancy-form">
                    <Form.Item
                        name="bloodGlucoseLevels"
                        label="Blood Glucose (mg/dL)"
                        rules={[{ required: true, message: "Please enter blood glucose level" }]}
                    >
                        <InputNumber min={50} max={500} style={{ width: "100%" }} placeholder="Enter glucose level" />
                    </Form.Item>

                    <Form.Item
                        name="bmi"
                        label="BMI (kg/m²)"
                        rules={[{ required: true, message: "Please enter BMI" }]}
                    >
                        <InputNumber min={10} max={60} style={{ width: "100%" }} placeholder="Enter BMI" />
                    </Form.Item>

                    <Form.Item
                        name="bloodPressure"
                        label="Blood Pressure (e.g. 120/80)"
                        rules={[{ required: true, message: "Please enter blood pressure" }]}
                    >
                        <Input placeholder="e.g. 120/80" />
                    </Form.Item>

                    <Form.Item
                        name="insulinDosage"
                        label="Insulin Dosage (IU)"
                        rules={[{ required: true, message: "Please enter insulin dosage" }]}
                    >
                        <InputNumber min={0} max={100} step={0.1} style={{ width: "100%" }} placeholder="Enter insulin dosage" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>

    );
};

export default Patient;
