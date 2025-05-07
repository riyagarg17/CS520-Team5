import sys
import json
import joblib
import numpy as np
from pathlib import Path

def load_model():
    try:
        # Get the paths to the model and scaler files
        base_path = Path(__file__).parent.parent.parent
        model_path = base_path / 'diabetes_rf_model.pkl'
        scaler_path = base_path / 'scaler.pkl'
        print(f"Loading model from: {model_path}")
        print(f"Loading scaler from: {scaler_path}")
        
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")
            
        if not scaler_path.exists():
            raise FileNotFoundError(f"Scaler file not found at {scaler_path}")
            
        # Load both model and scaler
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        print("Model and scaler loaded successfully")
        return model, scaler
    except Exception as e:
        print(f"Error in load_model: {str(e)}")
        raise

def predict(health_data):
    try:
        # Extract features in the correct order
        features = np.array([[
            float(health_data['bloodGlucoseLevels']),
            float(health_data['bmi']),
            float(health_data['bloodPressure'].split('/')[0]),  # Take systolic pressure
            float(health_data['insulinDosage'])
        ]])
        
        print("Original features:", features)
        
        # Load model and scaler
        model, scaler = load_model()
        
        # Scale the features
        scaled_features = scaler.transform(features)
        print("Scaled features:", scaled_features)
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        probabilities = model.predict_proba(scaled_features)[0]
        print(f"Prediction: {prediction}")
        print(f"Probabilities: {probabilities}")
        
        # Print the prediction (will be captured by Node.js)
        print(prediction)
    except Exception as e:
        print(f"Error in predict: {str(e)}")
        raise

if __name__ == '__main__':
    try:
        # Get health data from command line argument
        health_data = json.loads(sys.argv[1])
        predict(health_data)
    except Exception as e:
        print(f"Error in main: {str(e)}")
        sys.exit(1) 