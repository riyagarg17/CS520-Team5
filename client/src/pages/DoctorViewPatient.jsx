import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Row, Col, Button, Spin } from "antd";
import { ExclamationCircleOutlined, HeartTwoTone, FireTwoTone, SmileTwoTone } from "@ant-design/icons";
import { motion } from "framer-motion";
import ChatbotIcon from "../components/ChatbotIcon";
import "../styles/HealthPage.css";

const { Title, Text } = Typography;

const zoneColor = {
  Green: "#52c41a",
  Yellow: "#faad14",
  Red: "#ff4d4f",
};

const iconMap = {
  bloodGlucoseLevels: <FireTwoTone twoToneColor="#eb2f96" style={{ fontSize: "24px" }} />,
  bmi: <SmileTwoTone twoToneColor="#1890ff" style={{ fontSize: "24px" }} />,
  bloodPressure: <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: "24px" }} />,
  insulinDosage: <FireTwoTone twoToneColor="#fa8c16" style={{ fontSize: "24px" }} />,
};

const DoctorViewPatient = () => {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/patients/showHealthDetails/${encodeURIComponent(decodedEmail)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setHealthData(data.health_details);
      } catch (error) {
        console.error("Error fetching health data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (decodedEmail) {
      fetchHealthData();
    }
  }, [decodedEmail]);
  if (loading || !healthData) {
    return (
      <div className="health-page-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="health-page-container"
      style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '20px 20px 150px 20px' }}>
      <Title level={2} className="health-header">Patient Health Dashboard</Title>

      <Row gutter={[24, 24]} justify="center">
        {Object.entries(healthData).map(([key, value]) => {
          if (key === "zone" || key === "_id") return null;
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

      <ChatbotIcon />
    </div>
  );
};

export default DoctorViewPatient;
