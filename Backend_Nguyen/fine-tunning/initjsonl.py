import openai
from openai import OpenAI  # Importing OpenAI class
from datetime import datetime
import os
import json

# Định nghĩa hàm để mở tệp và trả về nội dung của nó dưới dạng chuỗi
def open_file(filepath):
    with open(filepath, 'r', encoding='utf=8') as infile:
        return infile.read()

# Định nghĩa hàm để lưu nội dung vào một tệp
def save_file(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as outfile:
        outfile.write(content)

# Khởi tạo thư mục để lưu các phản hồi
if not os.path.exists('responses'):
    os.mkdir('responses')

# Đọc các tệp không thay đổi trong quá trình lặp
problem = open_file('problem2/problems2.txt')
base_solver = open_file('problem2/prompt12.txt')
chatbot_prompt = open_file('problem2/sysprompt2.txt')

# Khởi tạo khóa API OpenAI
# Đặt khóa API OpenAI bằng cách đọc chúng từ các tệp
api_key = open_file('openaiapikey.txt')
client = openai.OpenAI(api_key=api_key)

# Khởi tạo tệp JSONL
jsonl_file = 'responses/schema2.jsonl'

# Số lần lặp / ví dụ
num_loops = 30

# Khởi tạo một danh sách trống để lưu các cuộc trò chuyện cho chatbot
conversation = []

def chatgpt(client, conversation, chatbot_prompt, solver, temperature=0.7, frequency_penalty=0.2, presence_penalty=0):
    conversation.append({"role": "user", "content": solver})
    messages_input = conversation.copy()
    prompt = [{"role": "system", "content": chatbot_prompt}]
    messages_input.insert(0, prompt[0])

    # Tạo một hoàn thành trò chuyện bằng cách sử dụng client của OpenAI
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=messages_input,
        temperature= temperature,
        frequency_penalty=frequency_penalty,
        presence_penalty=presence_penalty
    )

    # Trích xuất nội dung phản hồi trò chuyện một cách chính xác
    chat_response = completion.choices[0].message.content # Truy cập trực tiếp vào thuộc tính nội dung
    conversation.append({"role": "assistant", "content": chat_response})

    return chat_response

for i in range(num_loops):
    prob1 = chatgpt(client, conversation, chatbot_prompt, problem)
    solver = base_solver.replace("<<PROBLEM>>", prob1)
    response = chatgpt(client, conversation, chatbot_prompt, solver)

    # Tạo đối tượng JSON cho cuộc trò chuyện
    json_obj = {
        "messages":[
            {"role": "system", "content": chatbot_prompt},
            {"role": "user", "content": prob1},
            {"role": "assistant", "content": response}
        ]
    }

    # Thêm đối tượng JSON vào tệp JSONL
    with open(jsonl_file, 'a') as f:
        json.dump(json_obj, f)  # Ghi đối tượng JSON vào tệp
        f.write('\n')  # Thêm dấu xuống dòng

    print(f"Đã lưu ví dụ {i+1} vào {jsonl_file}")

    conversation.clear() # Xóa cuộc trò chuyện cho vòng lặp tiếp theo
