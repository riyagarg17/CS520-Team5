import React, { useEffect, useState } from 'react';
import ChatbotIcon from '../components/ChatbotIcon';
import PatientCard from '../components/PatientCard';
import { useNavigate } from 'react-router-dom';
import "../styles/PatientCard.css";
import "../styles/DoctorDashboard.css"; // Import your CSS file for styling

function HomePage() {
  // const [patients, setPatients] = useState([
  //   { _id: '1', name: 'John Doe', email: 'john.doe@example.com', age: 30 },
  //   { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', age: 25 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },
  //   { _id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 40 },


  // ]);



  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/doctors/getAllPatients');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPatients(data.body);
      } catch (err) {
        setError('Failed to fetch patients: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const navigate = useNavigate();



  const handlePatientClick = (email) => {
    console.log('Patient email clicked:', email);
    navigate(`/patients/healthDetails/${encodeURIComponent(email)}`);
  };
  

  return (
    <div>
      <h1 className="title">Welcome Doctor</h1>
      <ChatbotIcon />

      <h2 className="subtitle">Your Patient List:</h2>
      {loading && <p>Loading patients...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.isArray(patients) ? (
          patients.map((patient) => (
            <PatientCard className="patient-card" key={patient._id} patient={patient} onClick={() => handlePatientClick(patient.email)} />
          ))
        ) : (
          <p>No patients available</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
