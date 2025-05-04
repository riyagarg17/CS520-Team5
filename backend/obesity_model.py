import sys
import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Initialize model and scaler
model = RandomForestClassifier()
scaler = StandardScaler()

# Load your trained model and scaler here
# For now, we'll use a simple example
# You should replace this with your actual trained model
model.fit([[85.95, 17.94, 118.40, 5.16],  # Example training data
           [109.47, 24.25, 122.88, 18.54],
           [130.68, 35.24, 157.11, 49.62]],
          [0, 1, 2])  # 0: Low, 1: Medium, 2: High

scaler.fit([[85.95, 17.94, 118.40, 5.16],
            [109.47, 24.25, 122.88, 18.54],
            [130.68, 35.24, 157.11, 49.62]])

def predict_risk(data):
    try:
        # Extract features
        features = [
            data['bloodGlucoseLevels'],
            data['bmi'],
            float(data['bloodPressure'].split('/')[0]),  # Using systolic BP
            data['insulinDosage']
        ]
        
        # Scale features
        scaled_features = scaler.transform([features])
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        confidence = model.predict_proba(scaled_features)[0][prediction]
        
        risk_levels = ['Low', 'Medium', 'High']
        
        return {
            'riskLevel': risk_levels[prediction],
            'confidence': float(confidence)
        }
    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    result = predict_risk(input_data)
    print(json.dumps(result)) 