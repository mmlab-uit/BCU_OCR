import openai
from openai import OpenAI
# Define a function to open a file and return its contents as a string
def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as infile:
        return infile.read()

# Set the OpenAI API keys by reading them from files
api_key = open_file('openaiapikey.txt')

client = openai.OpenAI(api_key=api_key)

training_data_path = "E:/Call_API_CHATGPT_python/fine-tunning/responses/schema2.jsonl"

# Assuming the file name is 'processed_data.jsonl'
with open(training_data_path, "rb") as file:
    response = client.files.create(
        file=file,
        purpose='fine-tune'
    )

file_id = response.id  # Accessing the id attribute directly
print(f"File uploaded successfully with ID: {file_id}")
