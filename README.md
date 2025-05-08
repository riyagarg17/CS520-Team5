# Health Management Diabetes Tracker for CS520 

## Team Members
- Ansh Arora  
- Limbani Chaponda  
- Riya Garg  
- Sam O'Nuallain  

## Overview
The Health Management Diabetes Tracker is designed to help healthcare professionals, such as doctors and clinicians, efficiently manage and analyze patient data. This platform enables doctors to monitor multiple patients, extract insights, and make informed decisions quickly. By streamlining data tracking and analytics, doctors can better coordinate appointments and manage medical supplies based on patient needs.

The project focuses on tracking key health metrics, performing simple analytics, and providing an intuitive way for users to interact with the stored data.

## Features
- **Authentication**: Secure login system for doctors with username and password authentication.
- **Chatbot**: AI-powered chatbot that allows doctors to query patient data, identify patterns, and perform meta-analyses.
- **Safety Zones**: Categorization of patients into three zones based on health risk levels, providing a quick overview of critical cases.
- **Biometric Tracker**: Input and track key health metrics, including:
  - Blood Glucose Levels  
  - Body Mass Index (BMI)  
  - Blood Pressure  
  - Insulin Dosage  
- **Appointments Management**: Doctors can schedule and delete appointments with specific times and dates for each patient.

## Installation & Setup
To set up and run the project, follow these steps:

1. **Clone the Repository**
   ```sh
   git clone <repository_url>
   cd CS520-Team5
   ```

2. **Set up Python Virtual Environment**
   ```sh
   # Option 1: Using the setup script
   ./setup.sh

   # Option 2: Manual setup
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Install Node.js Dependencies**
   ```sh
   npm install 
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_uri

   # JWT Secret
   JWT_SECRET=your_jwt_secret

   # MFA Configuration
   MFA_SECRET=your_mfa_secret
   MFA_ISSUER=CareCompass
   MFA_ALGORITHM=sha1
   MFA_DIGITS=6
   MFA_PERIOD=30
   ```

5. **Run the Application**
   ```sh
   npm run
   ```

## Usage
- Log in with your registered credentials.
- Use the chatbot to retrieve patient insights and perform data analysis.
- View patients categorized into safety zones for quick assessment.
- Enter and monitor patient biometrics to track health trends.
- Schedule or cancel appointments as needed.

## Development Notes
- The project uses a Python virtual environment for machine learning components
- Make sure to activate the virtual environment before running the server:
  ```sh
  source venv/bin/activate
  ```
- The virtual environment is required for the risk prediction model to work properly
- Multi-Factor Authentication (MFA) requires proper configuration in the backend/.env file
- MFA uses TOTP (Time-based One-Time Password) for secure authentication

For any issues or further assistance, contact the development team.

---
**Note**: Ensure all patient data is handled securely and follows relevant privacy regulations.

