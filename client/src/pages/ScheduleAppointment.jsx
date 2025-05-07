import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Typography, Avatar, DatePicker, TimePicker, Row, Col, Empty, Spin } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "../styles/ScheduleAppointment.css";
import { getAllDoctors, scheduleAppointment, getBookedTimes } from "../api/services/patientService";
import { useUserContext } from "../context/UserContext";
import AlertBanner from "../components/AlertBanner";

const { Title, Text } = Typography;

const getGenderBasedAvatar = (gender, index) => {
    const base = gender?.toLowerCase() === "male" ? "men" : "women";
    const num = (index * 13) % 100;
    return `https://randomuser.me/api/portraits/${base}/${num}.jpg`;
};

const ScheduleAppointment = () => {
    const [doctorsList, setDoctorsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [unavailableTimes, setUnavailableTimes] = useState([]);
    const [alert, setAlert] = useState({ type: null, message: "" });
    const { user } = useUserContext();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getAllDoctors();
                setDoctorsList(response.body || []);
            } catch (err) {
                console.error("Failed to fetch doctors", err);
                showAlert("error", "Failed to load doctors");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchUnavailableTimes = async () => {
            if (!selectedDoctor || !selectedDate) return;

            try {
                const res = await getBookedTimes(selectedDoctor.email, selectedDate.format("YYYY-MM-DD"));
                console.log("booked times: ", res.body);
                setUnavailableTimes(res.body || []);
            } catch (err) {
                console.error("Failed to fetch booked times", err);
            }
        };

        fetchUnavailableTimes();
    }, [selectedDoctor, selectedDate]);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: null, message: "" }), 5000);
    };

    const handleOpenModal = (doctor) => {
        setSelectedDoctor(doctor);
        setVisibleModal(true);
        setSelectedDate(null);
        setSelectedTime(null);
        setUnavailableTimes([]);
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) return;

        try {
            await scheduleAppointment({
                patientEmail: user.email,
                doctorEmail: selectedDoctor.email,
                appointment_date: selectedDate.format("YYYY-MM-DD"),
                appointment_time: selectedTime.format("h:mm A")
            });

            showAlert("success", "Appointment scheduled successfully");
        } catch (err) {
            console.error("Failed to schedule appointment", err);
            showAlert("error", "Could not schedule appointment");
        } finally {
            setVisibleModal(false);
        }
    };

    const getDisabledHours = () => {
        if (!unavailableTimes || unavailableTimes.length === 0) return [];

        return unavailableTimes
            .map(time => {
                const hour = dayjs(time, "h:mm A", true).hour();
                return isNaN(hour) ? null : hour;
            })
            .filter(hour => hour !== null);
    };

    return (
        <div
            className="schedule-container"
            style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '20px 20px 120px 20px' }} // Increased bottom padding further
        >
            {alert.message && (
                <AlertBanner
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ type: null, message: "" })}
                />
            )}

            <Title level={2}>Book an Appointment</Title>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "2rem" }}><Spin size="large" /></div>
            ) : doctorsList.length === 0 ? (
                <Empty description={<span>No doctors available</span>} />
            ) : (
                <Row gutter={[24, 24]}>
                    {doctorsList.map((doc, index) => (
                        <Col xs={24} md={12} key={doc._id}>
                            <Card className="doctor-card" hoverable>
                                <div className="doctor-header">
                                    <Avatar size={64} src={getGenderBasedAvatar(doc.gender, index)} icon={<UserOutlined />} />
                                    <div className="doctor-info">
                                        <h3>{doc.name}</h3>
                                        <p><Text strong>Experience:</Text> {doc.experience} years</p>
                                        <p><Text strong>Gender:</Text> {doc.gender}</p>
                                        <p><Text strong>Pincode:</Text> {doc.pincode}</p>
                                    </div>
                                </div>
                                <Button
                                    icon={<CalendarOutlined />}
                                    type="primary"
                                    onClick={() => handleOpenModal(doc)}
                                >
                                    Check Availability
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal
                title={`Available Dates for ${selectedDoctor?.name}`}
                open={visibleModal}
                onOk={handleBook}
                onCancel={() => setVisibleModal(false)}
                okText="Book Appointment"
                okButtonProps={{ disabled: !selectedDate || !selectedTime }}
            >
                <div className="picker-group">
                    <DatePicker
                        style={{ width: "100%" }}
                        onChange={(date) => setSelectedDate(date)}
                        placeholder="Select a date"
                    />
                    <TimePicker
                        style={{ width: "100%" }}
                        use12Hours
                        format="h:mm A"
                        onChange={(time) => setSelectedTime(time)}
                        placeholder="Select a time"
                        disabledTime={() => ({
                            disabledHours: getDisabledHours
                        })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ScheduleAppointment;
