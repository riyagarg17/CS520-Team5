import React from 'react'; 
import ColorStatus from './ColorStatus.jsx';

const PatientCard = ({ patient, onClick }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', boxSizing: 'border-box', padding: '8px 16px' }}>
      <div className="patient-card" onClick={() => onClick(patient.email)} style={{ display: 'flex', gap: '16px', flex: 1, alignItems: 'center' }}>
        <ColorStatus color="red" size={10} />
        <span className="inline-text">{patient.name}</span>
        <span className="inline-text">{patient.email}</span>
        <span className="inline-text">Age: {patient.age}</span>
      </div>
    </div>
  );
};

export default PatientCard;
