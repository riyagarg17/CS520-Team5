import joblib
import numpy as np
from pathlib import Path

def test_prediction():
    try:
        # Get the paths to the model and scaler files
        base_path = Path(__file__).parent.parent.parent
        model_path = base_path / 'diabetes_rf_model.pkl'
        scaler_path = base_path / 'scaler.pkl'
        
        print(f"Loading model from: {model_path}")
        print(f"Loading scaler from: {scaler_path}")
        
        if not model_path.exists():
            print(f"Error: Model file not found at {model_path}")
            return False
            
        if not scaler_path.exists():
            print(f"Error: Scaler file not found at {scaler_path}")
            return False
            
        # Load the model and scaler
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        print("Model and scaler loaded successfully!")
        
        # Test data
        test_data = {
            'bloodGlucoseLevels': 85,  # Very normal fasting glucose
            'bmi': 20,                  # Lower end of healthy BMI range
            'bloodPressure': '105/65',  # Lower end of normal blood pressure
            'insulinDosage': 2          # Very low insulin dosage
        }
        
        # Extract features in the correct order
        features = np.array([[
            float(test_data['bloodGlucoseLevels']),
            float(test_data['bmi']),
            float(test_data['bloodPressure'].split('/')[0]),  # Take systolic pressure
            float(test_data['insulinDosage'])
        ]])
        
        print("\nOriginal input features:")
        print(f"Blood Glucose: {features[0][0]}")
        print(f"BMI: {features[0][1]}")
        print(f"Blood Pressure (systolic): {features[0][2]}")
        print(f"Insulin Dosage: {features[0][3]}")
        
        # Scale the features
        scaled_features = scaler.transform(features)
        print("\nScaled features:")
        print(scaled_features)
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        probabilities = model.predict_proba(scaled_features)[0]
        print(f"\nPrediction: {prediction}")
        print(f"Prediction probabilities: {probabilities}")
        print(f"Model classes: {model.classes_}")
        
        # Map prediction to zone
        zone_map = {
            0: 'green',  # Low risk (healthy values)
            1: 'yellow', # Medium risk
            2: 'red'     # High risk
        }
        
        zone = zone_map[prediction]
        print(f"Risk Zone: {zone.upper()}")
        
        return True
        
    except Exception as e:
        print(f"Error in test_prediction: {str(e)}")
        return False

if __name__ == '__main__':
    test_prediction() 