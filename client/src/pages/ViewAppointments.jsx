import React, { useState } from "react";
import { Card, Button, Modal, Typography, Avatar, DatePicker, TimePicker, notification, Select } from "antd";
import dayjs from "dayjs";
import "../styles/ViewAppointments.css";
import { motion } from "framer-motion";

const { Text, Title } = Typography;
const { Option } = Select;

const initialAppointments = [
    {
        id: 1,
        doctorName: "Dr. Asha Mehta",
        date: "2025-04-01",
        time: "10:00 AM",
        gender: "Female",
        experience: 12,
        pincode: 110045,
        status: "Confirmed",
        photo: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        doctorName: "Dr. Rajesh Kumar",
        date: "2025-04-02",
        time: "2:00 PM",
        gender: "Male",
        experience: 8,
        pincode: 110032,
        status: "Pending",
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
    }
];

const ViewAppointments = () => {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [rescheduleVisible, setRescheduleVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDate, setNewDate] = useState(null);
    const [newTime, setNewTime] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");

    const showRescheduleModal = (appointment) => {
        setSelectedAppointment(appointment);
        setRescheduleVisible(true);
    };

    const handleReschedule = () => {
        if (newDate && newTime) {
            const updated = appointments.map((appt) =>
                appt.id === selectedAppointment.id
                    ? {
                        ...appt,
                        date: newDate.format("YYYY-MM-DD"),
                        time: newTime.format("h:mm A"),
                        status: "Pending"
                    }
                    : appt
            );
            setAppointments(updated);
            notification.success({
                message: "Rescheduled",
                description: `Appointment with ${selectedAppointment.doctorName} has been rescheduled.`,
                duration: 3
            });
        }
        setRescheduleVisible(false);
        setNewDate(null);
        setNewTime(null);
        setSelectedAppointment(null);
    };

    const handleCancelAppointment = (id) => {
        Modal.confirm({
            title: "Cancel Appointment",
            content: "Are you sure you want to cancel this appointment?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                const cancelledAppt = appointments.find((appt) => appt.id === id);
                setAppointments(appointments.filter((appt) => appt.id !== id));
                notification.info({
                    message: "Appointment Cancelled",
                    description: `Appointment with ${cancelledAppt.doctorName} has been cancelled.`,
                    duration: 3
                });
            }
        });
    };

    const getStatusTag = (status) => {
        const classes = `status-tag ${status.toLowerCase()}`;
        return <span className={classes}>{status}</span>;
    };

    const filteredAppointments =
        statusFilter === "All"
            ? appointments
            : appointments.filter((appt) => appt.status === statusFilter);

    return (
        <div className="appointments-container">
            <Title level={2} className="appointments-header">
                Your Upcoming Appointments, Riya
            </Title>

            <div className="status-filter">
                <Select
                    defaultValue="All"
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: 200 }}
                >
                    <Option value="All">All</Option>
                    <Option value="Confirmed">Confirmed</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Cancelled">Cancelled</Option>
                </Select>
            </div>

            <div className="appointments-grid two-column-grid">
                {filteredAppointments.map((appt) => (
                    <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="appointment-card pretty-card" hoverable>
                            <div className="appointment-header">
                                <Avatar size={64} src={appt.photo} className="doctor-avatar" />
                                <div>
                                    <h3 className="doctor-name">{appt.doctorName}</h3>
                                    <p className="appointment-date">
                                        {dayjs(`${appt.date} ${appt.time}`).format("dddd, MMMM D, YYYY [at] h:mm A")}
                                    </p>
                                    {getStatusTag(appt.status)}
                                </div>
                            </div>
                            <div className="appointment-details">
                                <p><Text strong>Experience:</Text> {appt.experience} years</p>
                                <p><Text strong>Gender:</Text> {appt.gender}</p>
                                <p><Text strong>Pincode:</Text> {appt.pincode}</p>
                            </div>
                            <div className="appointment-actions">
                                <Button type="primary" onClick={() => showRescheduleModal(appt)}>
                                    Reschedule
                                </Button>
                                <Button type="default" danger onClick={() => handleCancelAppointment(appt.id)}>
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Modal
                title={`Reschedule Appointment with ${selectedAppointment?.doctorName}`}
                open={rescheduleVisible}
                onOk={handleReschedule}
                onCancel={() => setRescheduleVisible(false)}
                okText="Confirm"
                okButtonProps={{ disabled: !newDate || !newTime }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <DatePicker
                        style={{ width: "100%" }}
                        onChange={(date) => setNewDate(date)}
                        placeholder="Select new date"
                    />
                    <TimePicker
                        style={{ width: "100%" }}
                        use12Hours
                        format="h:mm A"
                        onChange={(time) => setNewTime(time)}
                        placeholder="Select new time"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ViewAppointments;
