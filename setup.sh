#!/bin/bash

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install required Python packages
pip install numpy scikit-learn joblib

# Print success message
echo "Virtual environment setup complete!"
echo "To activate the environment, run: source venv/bin/activate" 