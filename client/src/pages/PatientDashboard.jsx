import React from "react";
import { Card, Typography, Row, Col, Button } from "antd";
import { ExclamationCircleOutlined, HeartTwoTone, FireTwoTone, SmileTwoTone } from "@ant-design/icons";
import { motion } from "framer-motion";
import "../styles/HealthPage.css";

const { Title, Text } = Typography;

const healthData = {
    zone: "Red",
    bloodGlucoseLevels: 110.5,
    bmi: 22.3,
    bloodPressure: "118/76",
    insulinDosage: 8.5
};

const zoneColor = {
    Green: "#52c41a",
    Yellow: "#faad14",
    Red: "#ff4d4f"
};

const iconMap = {
    bloodGlucoseLevels: <FireTwoTone twoToneColor="#eb2f96" style={{ fontSize: "24px" }} />,
    bmi: <SmileTwoTone twoToneColor="#1890ff" style={{ fontSize: "24px" }} />,
    bloodPressure: <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: "24px" }} />,
    insulinDosage: <FireTwoTone twoToneColor="#fa8c16" style={{ fontSize: "24px" }} />
};

const HealthPage = () => {
    return (
        <div className="health-page-container">
            <Title level={2} className="health-header">Your Health Dashboard</Title>

            <Row gutter={[24, 24]} justify="center">
                {Object.entries(healthData).map(([key, value]) => {
                    if (key === "zone") return null;
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={key}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="health-card" hoverable>
                                    <div className="card-icon">{iconMap[key]}</div>
                                    <Text className="metric-label">{key.replace(/([A-Z])/g, " $1")}</Text>
                                    <Title level={3}>{value}</Title>
                                </Card>
                            </motion.div>
                        </Col>
                    );
                })}

                <Col xs={24}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card
                            className="zone-card"
                            style={{ borderLeft: `10px solid ${zoneColor[healthData.zone]}` }}
                        >
                            <div className="zone-header">
                                <Title level={4}>Zone Status: <span style={{ color: zoneColor[healthData.zone] }}>{healthData.zone}</span></Title>
                            </div>
                            {healthData.zone === "Red" ? (
                                <div className="zone-warning">
                                    <ExclamationCircleOutlined style={{ fontSize: "20px", color: "#ff4d4f", marginRight: 8 }} />
                                    <Text type="danger">You are in the red zone. Please schedule an appointment immediately.</Text>
                                    <br /><br />
                                    <Button type="primary" href="/schedule" danger>
                                        Schedule Appointment
                                    </Button>
                                </div>
                            ) : (
                                <Text>Your vitals look good. Keep monitoring regularly!</Text>
                            )}
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </div>
    );
};

export default HealthPage;
