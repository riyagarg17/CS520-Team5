import { Sequelize, DataTypes } from '@sequelize/core';

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "authentication.sqlite", 
});

export const Patient = sequelize.define("Patient", { 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Patient", "Doctor"),
        allowNull: false,
      },
      zone: {
        type: DataTypes.REAL,
        validate: {
          min: -1,
          max: 1,
        },
      },
      bloodGlucoseLevels: {
        type: DataTypes.REAL, // mg/DL
      },
      bmi: {
        type: DataTypes.REAL, // kg/m²
      },
      bloodPressure: {
        type: DataTypes.STRING, // e.g., "120/80"
      },
      insulinDosage: {
        type: DataTypes.REAL, // IU
      },
    });
  
  

await sequelize.sync(); 

export default Patient; 