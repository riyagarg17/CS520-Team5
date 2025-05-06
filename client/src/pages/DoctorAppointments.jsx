import React, { useEffect, useState } from "react";
import { Card, Button, Tag, Select, Row, Col, notification } from "antd";
import { motion } from "framer-motion";
import "../styles/DoctorAppointments.css";

const { Option } = Select;

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        const mockAppointments = [
            {
                _id: "1",
                patient_name: "Riya Garg",
                patient_gender: "Female",
                patient_pincode: 110045,
                appointment_date: "2025-04-10",
                appointment_time: "10:00 AM",
                status: "Confirmed"
            },
            {
                _id: "2",
                patient_name: "Arjun Shah",
                patient_gender: "Male",
                patient_pincode: 110051,
                appointment_date: "2025-04-12",
                appointment_time: "2:00 PM",
                status: "Pending"
            },
            {
                _id: "3",
                patient_name: "Fatima Khan",
                patient_gender: "Female",
                patient_pincode: 110011,
                appointment_date: "2025-04-15",
                appointment_time: "11:30 AM",
                status: "Cancelled"
            }
        ];
        setAppointments(mockAppointments);
        setFilteredAppointments(mockAppointments);
    }, []);

    const handleFilterChange = (value) => {
        setFilterStatus(value);
        if (value === "All") {
            setFilteredAppointments(appointments);
        } else {
            setFilteredAppointments(appointments.filter(app => app.status === value));
        }
    };

    const getStatusTag = (status) => {
        const color = {
            Confirmed: "green",
            Pending: "orange",
            Cancelled: "red"
        }[status] || "blue";

        return (
            <Tag color={color} className="glow-tag">
                {status.toUpperCase()}
            </Tag>
        );
    };

    const handleAccept = (id) => {
        const updated = appointments.map(app =>
            app._id === id ? { ...app, status: "Confirmed" } : app
        );
        setAppointments(updated);
        setFilteredAppointments(
            filterStatus === "All" ? updated : updated.filter(app => app.status === filterStatus)
        );
        notification.success({ message: "Appointment Accepted" });
    };

    const handleCancel = (id) => {
        const updated = appointments.map(app =>
            app._id === id ? { ...app, status: "Cancelled" } : app
        );
        setAppointments(updated);
        setFilteredAppointments(
            filterStatus === "All" ? updated : updated.filter(app => app.status === filterStatus)
        );
        notification.info({ message: "Appointment Cancelled" });
    };

    return (
        <div className="doctor-appointments-container">
            <h1 className="title">Your Appointments, Dr Mehta</h1>
            <div className="filter-section">
                <span>Filter by Status:</span>
                <Select value={filterStatus} onChange={handleFilterChange} className="filter-select">
                    <Option value="All">All</Option>
                    <Option value="Confirmed">Confirmed</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Cancelled">Cancelled</Option>
                </Select>
            </div>

            <Row gutter={[16, 16]}>
                {filteredAppointments.map((appt) => (
                    <Col xs={24} sm={12} md={12} lg={12} key={appt._id}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                            <Card className="appointment-card">
                                <div className="appointment-header">
                                    <img
                                        src="https://randomuser.me/api/portraits/lego/1.jpg"
                                        alt="Patient"
                                        className="avatar"
                                    />
                                    <div>
                                        <h3>{appt.patient_name}</h3>
                                        <p>{new Date(appt.appointment_date).toDateString()} at {appt.appointment_time}</p>
                                        {getStatusTag(appt.status)}
                                    </div>
                                </div>
                                <p><strong>Gender:</strong> {appt.patient_gender || "Not specified"}</p>
                                <p><strong>Pincode:</strong> {appt.patient_pincode || "-"}</p>

                                {appt.status === "Pending" && (
                                    <Button type="primary" onClick={() => handleAccept(appt._id)} style={{ marginRight: "0.5rem" }}>
                                        Accept
                                    </Button>
                                )}
                                {appt.status === "Confirmed" && (
                                    <Button danger onClick={() => handleCancel(appt._id)}>
                                        Cancel
                                    </Button>
                                )}
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DoctorAppointments;