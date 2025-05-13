import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Tag,
  Select,
  Row,
  Col,
  Empty,
  Spin,
  Avatar,
} from "antd";
import { motion } from "framer-motion";
import { useUserContext } from "../context/UserContext";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../api/services/doctorService";
import AlertBanner from "../components/AlertBanner";
import { UserOutlined } from "@ant-design/icons";
import "../styles/DoctorAppointments.css";
import dayjs from "dayjs";

const { Option } = Select;

// DoctorAppointments component: Displays and manages appointments for a logged-in doctor.
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: null, message: "" });
  const { user } = useUserContext();

  // useEffect hook to fetch doctor's appointments when the component mounts or user email changes.
  useEffect(() => {
    if (!user?.email) return;
  
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments(user.email);
        console.log("apts: ", data)
        const appts = (data || []).sort((a, b) => {
          const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
          const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
          return dateA - dateB;
        });
  
        setAppointments(appts);
        setFilteredAppointments(appts);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setAppointments([]);
        setFilteredAppointments([]);
        showAlert("error", "Error fetching appointments.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [user?.email]);
  

  // showAlert: Displays an alert banner for a short duration.
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: "" }), 5000);
  };

  // handleFilterChange: Updates the filtered appointments based on the selected status.
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setFilteredAppointments(
      value === "All"
        ? appointments
        : appointments.filter((app) => app.status === value)
    );
  };

  // getStatusTag: Returns a colored Ant Design Tag based on the appointment status.
  const getStatusTag = (status) => {
    const color = {
      Confirmed: "green",
      Pending: "orange",
      Cancelled: "red",
    }[status] || "blue";

    return <Tag color={color} className="glow-tag">{status.toUpperCase()}</Tag>;
  };

  // handleStatusChange: Updates the status of an appointment (e.g., Confirmed, Cancelled).
  const handleStatusChange = async (id, newStatus, patient_email) => {
    try {
      await updateAppointmentStatus({
        appointment_id: id,
        newStatus,
        doctorEmail: user.email,
        patientEmail: patient_email,
      });
  
      if (newStatus === "Cancelled") {
        const updated = appointments.filter(app => app.appointment_id !== id);
        setAppointments(updated);
        setFilteredAppointments(updated.filter(app =>
          filterStatus === "All" ? true : app.status === filterStatus
        ));
      } else {
        const updated = appointments.map(app =>
          app.appointment_id === id ? { ...app, status: newStatus } : app
        );
        setAppointments(updated);
        setFilteredAppointments(
          filterStatus === "All" ? updated : updated.filter(app => app.status === filterStatus)
        );
      }
  
      showAlert("success", `Appointment ${newStatus.toLowerCase()}`);
    } catch (err) {
      console.error(`Error updating status to ${newStatus}`, err);
      showAlert("error", `Failed to ${newStatus.toLowerCase()} appointment`);
    }
  };
  

  // getGenderBasedAvatar: Generates a random avatar URL based on patient gender.
  const getGenderBasedAvatar = (gender) => {
    const base = gender?.toLowerCase() === "male" ? "men" : "women";
    const num = Math.floor(Math.random() * 100);
    return `https://randomuser.me/api/portraits/${base}/${num}.jpg`;
  };

  return (
    <div className="doctor-appointments-container"
    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '20px 20px 150px 20px' }}>
      {alert.message && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: null, message: "" })}
        />
      )}

      <h1 className="title">Your Appointments, Dr {user?.name || "Doctor"}</h1>
      <div className="filter-section">
        <span>Filter by Status:</span>
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <Option value="All">All</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Spin size="large" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="no-appointments">
          <Empty description={<span>No appointments found.</span>} />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredAppointments.map((appt) => (
            <Col xs={24} sm={12} md={12} lg={12} key={appt.appointment_id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="appointment-card">
                  <div className="appointment-header">
                    <Avatar
                      size={64}
                      src={getGenderBasedAvatar(appt.patient_gender)}
                      icon={<UserOutlined />}
                    />
                    <div>
                      <h3>{appt.patient_name}</h3>
                      <p>
  {dayjs(`${appt.appointment_date} ${appt.appointment_time}`, "YYYY-MM-DD h:mm A").format("dddd, MMMM D, YYYY [at] h:mm A")}
</p>

                      {getStatusTag(appt.status)}
                    </div>
                  </div>
                  <p>
                    <strong>Email:</strong> {appt.patient_email || "Not specified"}
                  </p>

                  {appt.status === "Pending" && (
                    <Button
                      type="primary"
                      onClick={() => handleStatusChange(appt.appointment_id, "Confirmed", appt.patient_email)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Accept
                    </Button>
                  )}
                  {appt.status === "Confirmed" && (
                    <Button
                      danger
                      onClick={() => handleStatusChange(appt.appointment_id, "Cancelled",appt.patient_email)}
                    >
                      Cancel
                    </Button>
                  )}
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DoctorAppointments;
