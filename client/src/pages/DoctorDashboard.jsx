import React, { useEffect, useState } from "react";
import {
    Card,
    Typography,
    Row,
    Col,
    Modal,
    Avatar,
    Spin,
    Empty,
    Tag,
    Select,
    Button
} from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { useUserContext } from "../context/UserContext";
import { getDoctorPatients, alertPatient } from "../api/services/doctorService";
import "../styles/DoctorDashboard.css";
import ZonePieChart from "./ZonePieChart";

const { Title, Text } = Typography;
const { Option } = Select;

// DoctorDashboard component: Displays an overview of a doctor's patients, their health zones, and allows for alerts.
const DoctorDashboard = () => {
    const { user } = useUserContext();
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedZone, setSelectedZone] = useState("All");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [loading, setLoading] = useState(true);

    // useEffect hook to fetch the list of patients for the logged-in doctor.
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await getDoctorPatients(user.email);
                const result = response.body || [];
                setPatients(result);
                setFilteredPatients(result);
            } catch (err) {
                console.error("Failed to load doctor patients", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [user.email]);

    // getZoneStats: Calculates statistics about patient health zones (Red, Yellow, Green) and average health metrics.
    const getZoneStats = () => {
        let totalGlucose = 0, totalBMI = 0, totalInsulin = 0, totalBP = 0;
        let bpReadings = 0;

        patients.forEach((p) => {
            const hd = p.health_details;
            if (hd?.bloodGlucoseLevels) totalGlucose += hd.bloodGlucoseLevels;
            if (hd?.bmi) totalBMI += hd.bmi;
            if (hd?.insulinDosage) totalInsulin += hd.insulinDosage;
            if (hd?.bloodPressure) {
                const [systolic, diastolic] = hd.bloodPressure.split("/").map(Number);
                if (!isNaN(systolic) && !isNaN(diastolic)) {
                    totalBP += systolic;
                    bpReadings++;
                }
            }
        });

        const total = patients.length || 1;

        return {
            averages: {
                glucose: (totalGlucose / total).toFixed(1),
                bmi: (totalBMI / total).toFixed(1),
                insulin: (totalInsulin / total).toFixed(1),
                systolic: bpReadings > 0 ? (totalBP / bpReadings).toFixed(1) : "N/A"
            }
        };
    };

    // filterByZone: Filters the displayed patient list based on the selected health zone.
    const filterByZone = (zone) => {
        setSelectedZone(zone);
        if (zone === "All") {
            setFilteredPatients(patients);
        } else {
            setFilteredPatients(
                patients.filter(p => p.health_details?.zone?.toLowerCase() === zone.toLowerCase())
            );
        }
    };

    // showPatientDetails: Opens a modal to display detailed information about a selected patient.
    const showPatientDetails = (patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    // closeModal: Closes the patient details modal.
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
    };

    // hashEmailToNumber: Creates a pseudo-random number from an email string for avatar generation.
    const hashEmailToNumber = (email) => {
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 100);
    };

    const { averages } = getZoneStats();

    return (
        <div className="doctor-dashboard-container" style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto', padding: '20px 20px 150px 20px' }}>
            <Title level={2}>Your Patients</Title>

            <div style={{ marginBottom: "1rem" }}>
                <span style={{ marginRight: 10 }}>Filter by Zone:</span>
                <Select
                    value={selectedZone}
                    onChange={filterByZone}
                    style={{ width: 180 }}
                >
                    <Option value="All">All</Option>
                    <Option value="Red">Red</Option>
                    <Option value="Yellow">Yellow</Option>
                    <Option value="Green">Green</Option>
                </Select>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : filteredPatients.length === 0 ? (
                <Empty description={<span>No patients found</span>} />
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredPatients.map((patient) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={patient.email}>
                            <Card
                                className="patient-card"
                                hoverable
                                onClick={() => showPatientDetails(patient)}
                            >
                                <div className="card-header" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <Avatar
                                        size={48}
                                        src={`https://randomuser.me/api/portraits/${
                                            patient.gender?.toLowerCase() === "male" ? "men" : "women"
                                        }/${hashEmailToNumber(patient.email)}.jpg`}
                                        icon={<UserOutlined />}
                                    />
                                    <div>
                                        <h3 style={{ marginBottom: 4 }}>{patient.name}</h3>
                                        <p style={{ marginBottom: 0, fontSize: "14px", color: "#555" }}>
                                            {patient.email}
                                        </p>
                                        <p style={{ marginBottom: 0, fontSize: "14px", color: "#888" }}>
                                            Gender: {patient.gender}
                                        </p>
                                        {patient.health_details?.zone === "Red" && (
                                            <Tag color="red" style={{ marginTop: 5 }}>High Priority</Tag>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <div style={{ marginTop: 40, textAlign: "center" }}>
                <Button type="primary" onClick={() => setShowAnalytics(!showAnalytics)}>
                    {showAnalytics ? "Hide Analytics" : "View Analytics"}
                </Button>
            </div>

            {showAnalytics && (
                <div className="analytics-section" style={{ marginTop: 40 }}>
                    <Title level={4} style={{ marginTop: 32 }}>Zone Distribution</Title>
                    <ZonePieChart patients={patients}/>

                    <div style={{ marginTop: 20, textAlign: "center" }}>
                        <Text><strong>Avg Blood Glucose:</strong> {averages.glucose} mg/dL</Text><br />
                        <Text><strong>Avg BMI:</strong> {averages.bmi} kg/m²</Text><br />
                        <Text><strong>Avg Insulin Dosage:</strong> {averages.insulin} IU</Text><br />
                        <Text><strong>Avg Systolic BP:</strong> {averages.systolic} mmHg</Text><br />
                    </div>
                </div>
            )}

            <Modal
                title={selectedPatient?.name}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                {selectedPatient && (
                    <div className="patient-details">
                        <Text><strong>Email:</strong> {selectedPatient.email}</Text><br />
                        <Text><strong>Gender:</strong> {selectedPatient.gender}</Text><br />
                        <Text><strong>DOB:</strong> {new Date(selectedPatient.dob).toDateString()}</Text><br />
                        <Text><strong>Zone:</strong> {selectedPatient.health_details?.zone || "Unknown"}</Text><br />
                        <Text><strong>Blood Glucose:</strong> {selectedPatient.health_details?.bloodGlucoseLevels}</Text><br />
                        <Text><strong>BMI:</strong> {selectedPatient.health_details?.bmi}</Text><br />
                        <Text><strong>Blood Pressure:</strong> {selectedPatient.health_details?.bloodPressure}</Text><br />
                        <Text><strong>Insulin Dosage:</strong> {selectedPatient.health_details?.insulinDosage}</Text><br />

                        {selectedPatient.health_details?.zone === "Red" && (
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<BellOutlined />}
                                    onClick={async () => {
                                        try {
                                            await alertPatient(selectedPatient.email, selectedPatient.name);
                                        } catch (err) {
                                            console.error("Failed to alert patient", err);
                                        }
                                    }}
                                >
                                    Alert Patient
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DoctorDashboard;
