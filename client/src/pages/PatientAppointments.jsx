import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Avatar,
  DatePicker,
  TimePicker,
  Select,
  Empty,
  Modal
} from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { getAppointmentsByPatient, updateAppointment } from "../api/services/patientService";
import { UserOutlined } from "@ant-design/icons";
import AlertBanner from "../components/AlertBanner";
import "../styles/ViewAppointments.css";

const { Text, Title } = Typography;
const { Option } = Select;

// getGenderBasedAvatar: Generates a random avatar URL based on gender.
const getGenderBasedAvatar = (gender) => {
  const base = gender?.toLowerCase() === "male" ? "men" : "women";
  const num = Math.floor(Math.random() * 100);
  return `https://randomuser.me/api/portraits/${base}/${num}.jpg`;
};

// ViewAppointments component: Displays and manages appointments for a logged-in patient.
const ViewAppointments = () => {
  const { user } = useUserContext();
  const [appointments, setAppointments] = useState([]);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [alert, setAlert] = useState({ type: null, message: "" });
  const navigate = useNavigate();

  // useEffect hook to fetch patient's appointments when the component mounts or user changes.
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.email) return;
      try {
        const data = await getAppointmentsByPatient(user.email);
        setAppointments(data?.body || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        showAlert("error", "Failed to fetch appointments.");
      }
    };

    fetchAppointments();
  }, [user]);

  // showAlert: Displays an alert banner for a short duration.
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: "" }), 5000);
  };

  // showCancelModal: Opens the modal to confirm appointment cancellation.
  const showCancelModal = (appt) => {
    setAppointmentToCancel(appt);
    setCancelVisible(true);
  };

  // showRescheduleModal: Opens the modal for rescheduling an appointment.
  const showRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleVisible(true);
  };

  // handleReschedule: Submits the appointment reschedule request to the backend.
  const handleReschedule = async () => {
    if (!newDate || !newTime) return;
    try {
      await updateAppointment({
        appointment_id: selectedAppointment.appointment_id,
        new_date: newDate.format("YYYY-MM-DD"),
        new_time: newTime.format("h:mm A"),
        status: "Pending",
      });

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.appointment_id === selectedAppointment.appointment_id
            ? { ...appt, appointment_date: newDate.format("YYYY-MM-DD"), appointment_time: newTime.format("h:mm A"), status: "Pending" }
            : appt
        )
      );

      showAlert("success", `Appointment with ${selectedAppointment.doctor_name} rescheduled.`);
    } catch (err) {
      console.error("Reschedule Error:", err);
      showAlert("error", "Failed to reschedule appointment.");
    } finally {
      setRescheduleVisible(false);
      setNewDate(null);
      setNewTime(null);
      setSelectedAppointment(null);
    }
  };

  // const handleCancelAppointment = async () => {
  //   if (!appointmentToCancel) return;
  //   try {
  //     await updateAppointment({ appointment_id: appointmentToCancel.appointment_id, status: "Cancelled" });
  //     setAppointments((prev) => prev.filter((appt) => appt.appointment_id !== appointmentToCancel.appointment_id));
  //     showAlert("info", `Appointment with ${appointmentToCancel.doctor_name} cancelled.`);
  //   } catch (err) {
  //     console.error("Cancel Error:", err);
  //     showAlert("error", "Failed to cancel appointment.");
  //   } finally {
  //     setCancelVisible(false);
  //     setAppointmentToCancel(null);
  //   }
  // };


  // confirmCancelAppointment: Confirms and processes the cancellation of an appointment.
  const confirmCancelAppointment = async () => {
    try {
      await updateAppointment({
        appointment_id: appointmentToCancel,
        status: "Cancelled",
      });

      const updated = appointments.filter(
        (appt) => appt.appointment_id !== appointmentToCancel
      );

      setAppointments(updated);

      const filtered = statusFilter === "All"
        ? updated
        : updated.filter((a) => a.status === statusFilter);

      setAlert({ type: "info", message: "Appointment has been cancelled." });
      setTimeout(() => setAlert({ type: null, message: "" }), 5000);
    } catch (err) {
      console.error("Cancel Error:", err);
      setAlert({ type: "error", message: "Failed to cancel appointment." });
      setTimeout(() => setAlert({ type: null, message: "" }), 5000);
    } finally {
      setCancelVisible(false);
      setAppointmentToCancel(null);
    }
  };


  // getStatusTag: Returns a styled span element representing the appointment status.
  const getStatusTag = (status) => {
    const classes = `status-tag ${status.toLowerCase()}`;
    return <span className={classes}>{status}</span>;
  };

  // filteredAppointments: Filters appointments based on the selected status filter.
  const filteredAppointments =
    statusFilter === "All"
      ? appointments
      : appointments.filter((appt) => appt.status === statusFilter);

  return (
    <div className="appointments-container"
    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '20px 20px 150px 20px' }}>
      {alert.message && <AlertBanner type={alert.type} message={alert.message} onClose={() => setAlert({ type: null, message: "" })} />}

      <Title level={2} className="appointments-header">
        Your Upcoming Appointments
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

      {filteredAppointments.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <Empty description="You have no appointments." />
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={() => navigate("/schedule")}
          >
            Schedule Appointment
          </Button>
        </div>
      ) : (
        <div className="appointments-grid two-column-grid">
          {filteredAppointments.map((appt) => (
            <motion.div
              key={appt.appointment_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="appointment-card pretty-card" hoverable>
                <div className="appointment-header">
                  <Avatar size={64} src={getGenderBasedAvatar(appt.doctor_gender)} icon={<UserOutlined />} />
                  <div>
                    <h3 className="doctor-name">{appt.doctor_name}</h3>
                    <p className="appointment-date">
                      {dayjs(`${appt.appointment_date} ${appt.appointment_time}`).format(
                        "dddd, MMMM D, YYYY [at] h:mm A"
                      )}
                    </p>
                    {getStatusTag(appt.status)}
                  </div>
                </div>
                <div className="appointment-details">
                  <p>
                    <Text strong>Doctor Email:</Text> {appt.doctor_email}
                  </p>
                </div>
                <div className="appointment-actions">
                  <Button type="primary" onClick={() => showRescheduleModal(appt)}>
                    Reschedule
                  </Button>
                  <Button type="default" danger onClick={() => showCancelModal(appt)}>
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        title="Cancel Appointment"
        open={cancelVisible}
        onOk={confirmCancelAppointment}
        onCancel={() => {
          setCancelVisible(false);
          setAppointmentToCancel(null);
        }}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to cancel this appointment?</p>
      </Modal>

      <Modal
        title={`Reschedule Appointment with ${selectedAppointment?.doctor_name}`}
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
