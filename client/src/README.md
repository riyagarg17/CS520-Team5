# 🧭 Project Flow Overview (Patient & Doctor View)

This flow describes the end-to-end experience for both **Patient** and **Doctor** roles in the healthcare system, based on the current implementation.

---

## 🟢 1. User Entry Point

- User lands on the **Login Page**
  - Default mode: **Patient Login**
  - Option to navigate to **Doctor Login** via a clearly visible button
  - If not registered, user can click on **"Don't have an account? Sign Up"**

---

## 📝 2. Registration Flow

- Separate registration forms for **Doctor** and **Patient**, determined by role selection
- **Patient Registration** collects:
  - Name, Email, DOB, Gender, Password, Pincode
- **Doctor Registration** additionally requires:
  - **Medical Certificate (PDF upload)**
  - Years of Experience, Specialisation
- Upon successful registration:
  - Info is saved in MongoDB under **`patients`** or **`doctors`** collection accordingly
  - User is **automatically logged in** and redirected to the appropriate dashboard

---

## 👤 3. Patient Dashboard (After Login)

### 🎛️ The dashboard presents 4 core options:

#### 1. 🧾 Add/Update Health Details
- Opens a form to enter the following metrics:
  - BMI
  - Blood Pressure
  - Blood Glucose Level
  - Insulin Dosage
  - Zone (Red/Yellow/Green) auto-classified
- Data is saved to the **`health_details`** object in the `patients` collection

#### 2. 📅 View Upcoming Appointments
- Displays all **Confirmed** and **Pending** appointments
- Each card includes:
  - Doctor’s name
  - Appointment date and time
  - Status badge (with glowing tag)
- Available actions:
  - **Cancel Appointment**
  - **Reschedule Appointment** (opens date picker modal)

#### 3. 🩺 Schedule a New Appointment
- Shows a **list of all doctors**, each with:
  - Name
  - Gender
  - Years of Experience
  - Pincode
  - Photo
- Button: **Check Availability**
  - Opens a modal with calendar view
  - Non-available dates are greyed out
  - Patient selects date & time → clicks **"Book Appointment"**
  - Appointment is saved in both **Patient** and **Doctor** documents with status: `Pending`

#### 4. 📊 View Health Overview
- Shows health details in a clean dashboard with cards:
  - BMI, Blood Pressure, Blood Glucose, Insulin Dosage
  - Color-coded **Zone Level**: Red, Yellow, Green
- If **zone is Red**:
  - A warning is shown with **CTA to Schedule an Appointment**

---

## 👨‍⚕️ 4. Doctor Dashboard (After Login)

### 🧠 Default Landing Page: Doctor Overview
- Comprehensive **dashboard summarizing patient data**:
  - Total number of patients
  - Number of patients in each **Zone**:
    - 🔴 Red Zone count
    - 🟡 Yellow Zone count
    - 🟢 Green Zone count
- Data is derived from embedded patient appointment and health data

### 🧭 Top Navigation Bar Includes:
- **Dashboard** (default view)
- **Appointments**
  - Displays all current/upcoming appointments
  - Each card includes:
    - Patient name, gender, pincode
    - Appointment date & time
    - Current status (`Pending`, `Confirmed`)
    - Profile photo
  - Doctors can:
    - ✅ **Accept pending appointments**
    - ❌ **Cancel confirmed appointments**

---

## ✅ Summary of Data Flow

### 📂 Collections:
- `patients`
  - Health details, embedded appointments
- `doctors`
  - Embedded appointments, medical license PDF (via GridFS)

### 🔄 Appointment Synchronization
- When a patient books or cancels an appointment:
  - Both `patients` and `doctors` documents are updated

---

