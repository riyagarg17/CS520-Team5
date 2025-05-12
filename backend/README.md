# Backend

## Setup
Follow installation instructions in main README.md, especially setting up the python environment.

API keys such as the mongodb and OpenAI keys are needed to run the backend. Create a .env file in this directory to store the keys if the file is not already present.

One setup is finished, run:
```bash
npx nodemon app.js
```

## Models
More information about data models can be found in models-readme.md.

## Controllers
Controllers serve as the interface between users of the data and the underlying data models. Controllers are split up into three main use cases:
- **Doctor Controller:** Handles requests from doctors such as upcoming appointments and patient health information
- **Patient Controller:** Handles requests from patients such as upcoming appointments and doctor information
- **Chatbot Controller:** Handles requests to the chatbot such as sending messages and getting responses. The chatbot is powered by OpenAI's GPT-4o model, and has access to the doctor and patient controllers.