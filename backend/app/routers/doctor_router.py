from typing import Annotated
from fastapi import APIRouter, Body
from app.services.doctor_service import DoctorService
from app.models.doctor import Doctor
from app.models.login import Login

from app.shared.response import Response
# from app.models.location import Location
# from passlib.context import CryptContext
# from app.models.doctor import DoctorSchedule

app = APIRouter()

doctor_service = DoctorService()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# @app.get("/", response_model=Response)
# async def health_check():
#     return Response(status_code=200, body="I will make sure you're alive.")

@app.post("/addDoctor", response_model = Response)
async def add_doctor(doctor: Annotated[Doctor, Body()]):
    """
    Endpoint to add a new doctor to the database.

    Args:
        doctor (Doctor): A Doctor object containing doctor details.

    Returns:
        JSON response indicating success or failure.
    """
    status_code, response = await doctor_service.add_doctor(doctor)
    return Response(status_code=status_code, body=response)

@app.get("/{pincode}/allDoctors", response_model=Response)
async def add_doctor(pincode: int):
    """
    Endpoint to get all doctors in a given pincode.

    Args:
        pincode (int): Pincode of the area.

    Returns:
        JSON response containing the list of doctors in the given pincode.
    """
    try:
        status_code, response = await doctor_service.get_doctor_by_pincode(pincode)
        return Response(status_code=status_code, body=response)
    except Exception as e:
        return Response(status_code=500, body=f"An error occurred: {str(e)}")

@app.post("/setAddress", response_model = Response)
async def set_location_for_doctor(email: Annotated[str, Body()], location: Annotated[Location, Body(embed=True)]):
    """
    Endpoint to set the address for a doctor.

    Args:
        doctor_email (str): Email of the doctor.
        address (Location): Address of the doctor.

    Returns:
        JSON response indicating success or failure.
    """
    try:
        status_code, response = await doctor_service.set_location_for_doctor(email, location)
        return Response(status_code=status_code, body={"message": response})
    except Exception as e:
        return Response(status_code=500, body=f"An error occurred: {str(e)}")

@app.get("/{email}/schedule", response_model= Response)
async def get_schedule_by_email(email: str):
    """
    Endpoint to get schedule of a doctor

    Args:
        email (str): Email of doctor

    Returns:
        JSON response of the schedule

    """
    try:
        status_code, response = await doctor_service.get_schedule_by_email(email)
        return Response(status_code=status_code, body=response)
    except Exception as e:
        return Response(status_code=500, body = f"An error occured: {str(e)}")


@app.get("/doctor/{email}", response_model=Response)
async def get_doctor(email: str):
    """
    Endpoint to get a doctor's details by email.

    Args:
        email (str): Email of the doctor.

    Returns:
        JSON response containing the doctor's details.
    """
    try:

        status_code, doctor_details = await doctor_service.get_doctor_by_email(email)
        return Response(status_code=status_code, body=doctor_details)
    except Exception as e:
        return Response(status_code=500, body=f"An error occurred: {str(e)}")

@app.post("/doctor/doctorSchedule", response_model=Response)
async def save_availability(availability: DoctorSchedule):
    """
    Endpoint to save a doctor's availability.

    Args:
        availability (DoctorSchedule): An DoctorSchedule object containing availability details.

    Returns:
        JSON response indicating success or failure.
    """
    try:
        # Logic to save availability in the database
        # You can create a new service method to handle this
        # For example:
        status_code, response = await doctor_service.save_availability(availability)
        return Response(status_code=status_code, body={"message": response})
    except Exception as e:
        return Response(status_code=500, body=f"An error occurred: {str(e)}")


@app.post("/doctorLogin", response_model=Response)
async def login_doctor(data: Login):
    """
    Login a doctor with email and password.
    """

    status_code, response = await doctor_service.login_doctor(data)
    return Response(status_code=status_code, body=response)