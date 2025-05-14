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

1. **Clone the Repository**
   ```sh
   git clone <repository_url>
   cd CS520-Team5
   ```

2. **Frontend Setup**
   ```sh
   # Navigate to client directory
   cd client

   # Install dependencies
   npm install

   # Start the development server
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

3. **Backend Setup**

   Setup the virtual environment first: 

   ```sh
   # Option 1: Using the setup script
   ./setup.sh

   # Option 2: Manual setup
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
   ```sh
   # Navigate to backend directory
   cd backend

   # Install dependencies
   npm install

   # Configure environment variables
   # Create a .env file with the following:
   MONGODB_URI=your_mongodb_uri
   PORT=backend_port
   SENDGRID_API_KEY=sendgrid_api_key
   SENDGRID_VERIFIED_SENDER=riyagarg8d@gmail.com
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_password
   OPENAI_API_KEY=your_openai_key

   # Start the server
   node app.js
   ```

   The backend will be available at `http://localhost:8080`

Contact the dev team for the required environment variables and credentials.

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


