import React, { useState } from "react";
import { Card, Button, Modal, Typography, Avatar, DatePicker, TimePicker, Row, Col } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "../styles/ScheduleAppointment.css";

const { Title, Text } = Typography;

const doctorsList = [
    {
        id: 1,
        name: "Dr. Asha Mehta",
        gender: "Female",
        experience: 12,
        pincode: 110045,
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
        unavailableDates: ["2025-03-28", "2025-04-01"]
    },
    {
        id: 2,
        name: "Dr. Rajesh Kumar",
        gender: "Male",
        experience: 8,
        pincode: 110032,
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
        unavailableDates: ["2025-03-27"]
    }
];

const ScheduleAppointment = () => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const handleOpenModal = (doctor) => {
        setSelectedDoctor(doctor);
        setVisibleModal(true);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleBook = () => {
        if (selectedDate && selectedTime) {
            console.log("Booking Appointment", {
                doctor: selectedDoctor.name,
                date: selectedDate.format("YYYY-MM-DD"),
                time: selectedTime.format("h:mm A")
            });
            setVisibleModal(false);
        }
    };

    return (
        <div className="schedule-container">
            <Title level={2}>Book an Appointment</Title>
            <Row gutter={[24, 24]}>
                {doctorsList.map((doc) => (
                    <Col xs={24} md={12} key={doc.id}>
                        <Card className="doctor-card" hoverable>
                            <div className="doctor-header">
                                <Avatar size={64} src={doc.photo} icon={<UserOutlined />} />
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
                        disabledDate={(current) =>
                            selectedDoctor?.unavailableDates?.includes(current?.format("YYYY-MM-DD"))
                        }
                        placeholder="Select a date"
                    />
                    <TimePicker
                        style={{ width: "100%" }}
                        use12Hours
                        format="h:mm A"
                        onChange={(time) => setSelectedTime(time)}
                        placeholder="Select a time"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ScheduleAppointment;