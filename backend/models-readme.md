## 🗂️ Doctor and Patient Database Schema (MongoDB)

---

### 🩺 **Doctor Schema**

#### **Fields:**
| Field                 | Type             | Description                              |
|----------------------|------------------|------------------------------------------|
| `_id`                | `ObjectId`       | Auto-generated unique ID                 |
| `email`              | `string`         | Unique email address                     |
| `name`               | `string`         | Full name                                |
| `dob`                | `string`         | Date of birth (ISO 8601)                 |
| `gender`             | `string`         | `Male`, `Female`, or `Other`             |
| `password`           | `string`         | Hashed password                          |
| `pincode`            | `number`         | Area pin code                            |
| `pdf_file_id`        | `string\|null`   | Optional GridFS file ID                  |
| `years_of_experience`| `number`         | Number of years of experience            |
| `appointments`       | `Array<Object>`  | List of appointment entries              |

#### Appointment Subdocument:
| Field               | Type       | Description                           |
|--------------------|------------|---------------------------------------|
| `_id`              | `ObjectId` | Unique appointment ID                 |
| `patient_email`    | `string`   | Email of the patient                  |
| `patient_name`     | `string`   | Name of the patient                   |
| `appointment_date` | `string`   | ISO date string                       |
| `appointment_time` | `string`   | e.g., "10:00 AM"                      |
| `status`           | `string`   | `Confirmed`, `Pending`, `Cancelled`   |

---

### 👤 **Patient Schema**

#### **Fields:**
| Field             | Type            | Description                            |
|------------------|-----------------|----------------------------------------|
| `_id`            | `ObjectId`      | Auto-generated unique ID               |
| `name`           | `string`        | Full name                              |
| `email`          | `string`        | Unique email address                   |
| `dob`            | `string`        | Date of birth                          |
| `gender`         | `string`        | Gender                                 |
| `age`            | `number`        | Age in years                           |
| `password`       | `string`        | Hashed password                        |
| `pincode`        | `number`        | Area pin code                          |
| `appointments`   | `Array<Object>` | List of appointments                   |
| `health_details` | `Object`        | Medical readings and metrics           |

#### Appointment Subdocument:
Same as in doctor schema, with:
- `doctor_email`
- `doctor_name`

#### `health_details` Fields:
| Field                | Type     | Description                  |
|---------------------|----------|------------------------------|
| `zone`              | `string` | `Red`, `Yellow`, or `Green`  |
| `bloodGlucoseLevels`| `number` | in mg/dL                     |
| `bmi`               | `number` | in kg/m²                     |
| `bloodPressure`     | `string` | e.g., "120/80"               |
| `insulinDosage`     | `number` | in IU                        |

---

## 📄 JSON Schema Definitions

### Doctor Schema (JSON Schema)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["email", "name", "dob", "gender", "password", "pincode", "years_of_experience"],
  "properties": {
    "email": { "type": "string", "format": "email" },
    "name": { "type": "string" },
    "dob": { "type": "string", "format": "date" },
    "gender": { "type": "string" },
    "password": { "type": "string" },
    "pincode": { "type": "integer" },
    "pdf_file_id": { "type": ["string", "null"] },
    "years_of_experience": { "type": "number" },
    "appointments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["patient_email", "patient_name", "appointment_date", "appointment_time", "status"],
        "properties": {
          "_id": { "type": "string" },
          "patient_email": { "type": "string" },
          "patient_name": { "type": "string" },
          "appointment_date": { "type": "string" },
          "appointment_time": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  }
}
```

### Patient Schema (JSON Schema)
(Similar to Doctor, with `doctor_email`, `doctor_name`, and `health_details` added)

---

## 🧱 MongoDB Models (Mongoose Example)

### Doctor (Mongoose Schema)
```js
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient_email: String,
  patient_name: String,
  appointment_date: String,
  appointment_time: String,
  status: String
});

const DoctorSchema = new mongoose.Schema({
  email: String,
  name: String,
  dob: String,
  gender: String,
  password: String,
  pincode: Number,
  pdf_file_id: String,
  years_of_experience: Number,
  appointments: [AppointmentSchema]
});

module.exports = mongoose.model("Doctor", DoctorSchema);
```

### Patient Model is similar with:
- `doctor_name`, `doctor_email` in appointments
- `health_details` as an embedded object

---

## 🔷 Visual ER Diagram (Text Format)
```
Doctor
  |_ email (PK)
  |_ name
  |_ pdf_file_id
  |_ appointments[] ------> Patient
                              |_ name
                              |_ email (PK)
                              |_ health_details
```

