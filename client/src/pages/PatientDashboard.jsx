import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Button, Spin } from "antd";
import { ExclamationCircleOutlined, HeartTwoTone, FireTwoTone, SmileTwoTone } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useUserContext } from "../context/UserContext";
import { getPatientHealthDetails } from "../api/services/patientService";
import ChatbotIcon from "../components/ChatbotIcon"; // Import the new component
import "../styles/HealthPage.css";

const { Title, Text } = Typography;

const zoneColor = {
  green: "#52c41a",
  yellow: "#faad14",
  red: "#ff4d4f"
};

const iconMap = {
  bloodGlucoseLevels: <FireTwoTone twoToneColor="#eb2f96" style={{ fontSize: "24px" }} />,
  bmi: <SmileTwoTone twoToneColor="#1890ff" style={{ fontSize: "24px" }} />,
  bloodPressure: <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: "24px" }} />,
  insulinDosage: <FireTwoTone twoToneColor="#fa8c16" style={{ fontSize: "24px" }} />
};

const HealthPage = () => {
  const { user } = useUserContext();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user?.email) {
      const fetchHealthData = async () => {
        try {
          const response = await getPatientHealthDetails(user.email);
          console.log("Health data from backend:", response);
          setHealthData(response);
        } catch (error) {
          console.error("Error fetching health data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchHealthData();
    }
  }, [user?.email]);

  if (!user || !user.email || loading || !healthData) {
    return (
      <div className="health-page-container">
        <Spin size="large" />
      </div>
    );
  }

  console.log("Current healthData state:", healthData);
  console.log("Zone:", healthData.zone);

  return (
    <div className="health-page-container"
    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '20px 20px 150px 20px' }}>
      <Title level={2} className="health-header">Your Health Dashboard, {user?.name || "Patient"}!</Title>

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
              style={{ borderLeft: `10px solid ${zoneColor[healthData.zone?.toLowerCase()]}` }}
            >
              <div className="zone-header">
                <Title level={4}>Zone Status: <span style={{ color: zoneColor[healthData.zone?.toLowerCase()] }}>{healthData.zone?.toUpperCase()}</span></Title>
              </div>
              <Text>
                {healthData.zone?.toLowerCase() === 'green' ? 
                  "Your vitals are in a healthy range. Keep up the good work!" :
                  healthData.zone?.toLowerCase() === 'yellow' ?
                  "Your vitals need attention. Consider consulting your doctor soon." :
                  "Your vitals require immediate attention. Please consult your doctor as soon as possible."}
              </Text>
            </Card>
          </motion.div>
        </Col>
      </Row>

            <ChatbotIcon />
    </div>
  );
};

export default HealthPage;
