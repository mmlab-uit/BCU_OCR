import openai

# Define a function to open a file and return its contents as a string
def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as infile:
        return infile.read()

# Set the OpenAI API keys by reading them from files
api_key = open_file('openaiapikey.txt')

# Initialize the OpenAI client with the API key
client = openai.Client(api_key=api_key)

# Using the provided file_id
training_file_id = "file-mROuO4JtKXjgsx4VS2UhDAsO"
model_name = "gpt-3.5-turbo-1106" # Or another base model 

# Start fine-tuning
response = client.fine_tuning.jobs.create(
    training_file = training_file_id,
    model = model_name
)

job_id = response.id
print(f"Fine-tuning job created successfully with ID: {job_id}")
