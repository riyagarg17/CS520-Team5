import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { DoctorCalendar } from "./Calendars";
import { useGetSchedule } from "../hooks/useGetSchedule";
import dayjs from "dayjs";

export const DoctorCheckAvailabilityModal = ({ open, onClose, email }) => {
    const [isModalOpen, setIsModalOpen] = useState(open);
    const {
        data: scheduleData,
        loading: scheduleLoading,
        error: scheduleError,
    } = useGetSchedule(email);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const navigate = useNavigate();

    const onSelect = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        if (open) {
            setIsModalOpen(true);
        }
    }, [email, open]);

    const onClick = () => {
        console.log("data", email, " ", selectedDate);
        navigate(`/payment?doctorEmail=${email}&day=${selectedDate}`, {
            // navigate(`/patient/payment`, {
            replace: true,
        });
        onClose();
    };

    const handleOk = () => {
        // navigate(`/payment`, {
        //   replace: true,
        // });
        onClose();
    };

    return (
        <>
            <Modal
                loading={scheduleLoading}
                open={isModalOpen}
                centered
                title="Doctor's availability"
                onOk={handleOk}
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Close
                    </Button>,
                    <Button
                        id="scheduleAppointment"
                        key="submit"
                        type="primary"
                        onClick={onClick}
                    >
                        Schedule Appointment
                    </Button>,
                ]}
            >
                <DoctorCalendar
                    loading={scheduleLoading}
                    schedule={scheduleData}
                    onSelect={onSelect}
                />
            </Modal>
        </>
    );
};