# BACKEND: OCR and Fast API

This project provide an API for optical character recognition (OCR) and text conversion using FastAPI, OpenAI GPT-3.5, Veryfi API and Google Cloud Vision API.

## Features

- Extract text from images using Veryfi or Google Vision.
- Convert raw text into hierarchical JSON using OpenAI GPT-3.5.
- Generate API keys for secure access.

## Technologies used

- [FastAPI](https://fastapi.tiangolo.com)
- [OpenAI GPT-3.5 API](https://platform.openai.com)
- [Veryfi API](https://www.veryfi.com)
- [Google Vision API](https://cloud.google.com/vision)
- Python 3.12
## Installation 

1. ### Clone the repository:

   ```bash
   https://github.com/SmaugTHEDrag/OCR_backend.git
   cd repository

2. ### Install dependencies:
   
   ```bash
   pip install -r requirements.txt
   ```
3. ### Set up an environment 

Create a `.env` file in the root directory and add the following:
   ```makefile
   OPENAI_API_KEY = your_openai_api_key
   ```
Replace your_openai_api_key with your actual OpenAI API key.  

4. ### Run the FastAPI server

   ```bash
   uvicorn main:app --port 3000  --reload
   ```
Replace `main` with the filename containing your FastAPI application.

# FRONTEND: Website for testing API services from BACKEND.

### HOW TO RUN:

#### OPTION 1: run with docker (required docker installation)
-  ```bash 
   docker-compose up --build 
   ```
- The first time it will take about 3 minutes, after finished, go to localhost 3000.(After the first time it will only take a few seconds)

- To stop running press ctrl + c twice

#### OPTION 2: install packages
-  ```bash
   npm install
   ```

-  ```bash 
   npm start 
   ```

- Then the website will run on port 3000.

- To stop running, press ctrl + c + y then enter.
