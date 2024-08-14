# các thư viện cần thiết 
from fastapi import FastAPI, HTTPException, File, UploadFile, Query, Depends
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
from fastapi.responses import FileResponse
import io
import veryfi
import tempfile
import os
from typing import List
from google.cloud import vision
from google.oauth2 import service_account
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import uvicorn
import datetime
load_dotenv()
app = FastAPI()

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "https://your-frontend-domain.com",
    "https://ocrproject.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# xem thử hoạt động của fastapi
@app.get("/")
async def test():
    return {"message":"Hello World!"}

# http://localhost:3000/docs to see all endpoint

# Hàm tạo một api key dựa trên thời gian hiện tại datetime 
def generate_api_key(specific_datetime=None):
    # Cung cấp datetime hoặc the thời gian hiện tại nếu không có thời gian cung cấp cụ thể 
    if specific_datetime is None:
        specific_datetime = datetime.datetime.now()
    # Lấy datetime trong string format theo từng giây
    datetime_str = specific_datetime.strftime("%Y-%m-%d %H:%M:%S")
    # Generate a SHA-256 hash dựa trên datetime
    hash_object = hashlib.sha256(datetime_str.encode())
    hash_hex = hash_object.hexdigest()
    return hash_hex

# API để tạo ra api key của web
@app.get("/generate-api-key")
def get_api_key():
    PAN_api_key = generate_api_key()
    return {"api_key":PAN_api_key}

# Thông tin xác thực Google Vision
""" service_account_json = 'service_key.json'
credentials = service_account.Credentials.from_service_account_file(service_account_json)
google_vision_client = vision.ImageAnnotatorClient(credentials=credentials) """

# Thông tin xác thực của veryfi
""" client_id = 'vrfugnuC7pH7J5dfppyNMuWFiCmts7J92wACJcS'
client_secret = 'YMPB03oYWcEfR4zasSxYHGdTCMt1NPTvt6E9bXmlG8XsJSIbiKgVo4fkggUzMSyzPC7upDSCkH8Tb4kd0JYgtZvYlVXHMABylfE5mV6BH5f1AGVmU9HdbthXunY5jgl1'
username = 'sunday142857'
api_key = '7feec8485de62558fb3b8b1a8cae9327' """


# Xác thực dựa trên PAN_api_key
def validate_api_key(PAN_api_key: str):
    current_time = datetime.datetime.now()
    # lưu trữ api key trong 30 ngày 
    for day_offset in range(30):
        date_to_check = current_time - datetime.timedelta(days=day_offset)
        for second_offset in range(86400):  # 86400 giây mỗi ngày 
            time_to_check = date_to_check - datetime.timedelta(seconds=second_offset)
            expected_api_key = generate_api_key(time_to_check)
            if PAN_api_key == expected_api_key:
                return PAN_api_key
    raise HTTPException(status_code=403, detail="Invalid API key")

# API dùng để chọn service OCR của 2 API là Veryfi và GG_vision để từ đó ra string, raw text 
@app.post("/text-extraction")
async def extract_text_from_image(service: str = Query("--", enum=["Veryfi", "GG_vision"]), PAN_api_key: str = Depends(validate_api_key),
                                  client_id: str = Query(None), client_secret: str = Query(None),username: str = Query(None), api_key: str = Query(None),
                                  gg_vision_key: UploadFile = File(None), file: UploadFile = File(...)):
    try:
        match service:
            case "Veryfi":
                if not all([client_id, client_secret, username, api_key]):
                   raise HTTPException(status_code=400, detail="All veryfi credentials are required")
                veryfi_client = veryfi.Client(client_id, client_secret, username, api_key)
                with tempfile.TemporaryDirectory() as tmpdir:
                # Lưu tệp đã tải lên vào thư mục tạm thời
                    file_path = os.path.join(tmpdir, file.filename)
                    with open(file_path, "wb") as buffer:
                        buffer.write(await file.read())
                    # Xử lý tài liệu bằng API của Veryfi
                    response = veryfi_client.process_document(file_path, categories= ['Grocery', 'Utilities', 'Travel'])
                    # with open("raw_text.txt", "w+", encoding='utf-8') as f:
                        # f.write(response['ocr_text'])
                    response = response['ocr_text']
                return {"raw_text": response}
            case "GG_vision":
                if not gg_vision_key:
                   raise HTTPException(status_code=400, detail="Google Vision key is required")
                service_account_json = await gg_vision_key.read()
                # Tạo một tệp tạm thời để lưu trữ service account JSON
                with tempfile.NamedTemporaryFile(delete=False) as temp_json:
                   temp_json.write(service_account_json)
                   temp_json.flush()
                   # Tạo credentials từ service account file
                   credentials = service_account.Credentials.from_service_account_file(temp_json.name)
                   google_vision_client = vision.ImageAnnotatorClient(credentials=credentials) 
                   # Đọc nội dung của file ảnh từ 'file' và tạo đối tượng image
                   content = await file.read()
                   image = vision.Image(content=content)
                   response = google_vision_client.document_text_detection(image=image)
                   raw_text = response.full_text_annotation.text
                   # with open("raw_text.txt", "w", encoding='utf-8') as f:
                      # f.write(raw_text)
                return {"raw_text": raw_text}
            case _:
                raise HTTPException(status_code=400, detail="Choosing service")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
# Đặt khóa API của OpenAI của bạn
openai_api_key = os.getenv("OPENAI_API_KEY")

# Hàm để đọc nội dung từ một tệp văn bản
def read_text_file(filename):
    with open(filename, "r", encoding="utf-8") as file:
        content = file.read()
    return content

# Hàm để ghi nội dung vào một tệp văn bản
def write_text_file(filename, content):
    content = content.strip("```")
    with open(filename, "w", encoding="utf-8") as file:
        file.write(content + "\n")

# API để convert từ raw text, string sang hierarchical json và từ đó lấy thông tin chính xác từ đó và điền vào template được cho
@app.post("/convert")
async def convert(raw_text: str, template: str):
    try:
        ##### TỪ STRING ĐỔI SANG HIERARCHICAL JSON #####
        ################################################

        # Đọc nội dung ban đầu từ raw text
        text_content = raw_text + "\nRESPONSE: "

        # Khởi tạo một danh sách các tin nhắn với nội dung ban đầu
        messages = [{"role": "assistant", "content": text_content}]
        
        # Thêm đầu vào của người dùng vào lịch sử cuộc trò chuyện
        messages.append({"role": "user", "content": text_content})
        
        # Gửi tin nhắn đến OpenAI và nhận phản hồi
        response = openai.ChatCompletion.create(
            # Model để từ string, raw text ra hierarchical json
            model="ft:gpt-3.5-turbo-1106:personal::9GojMIMF:ckpt-step-90",
            messages=messages,
            temperature=0,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        # Trích xuất câu trả lời từ phản hồi
        reply = response.choices[0].message.content
        
        # Lưu câu trả lời của Bot vào output.json
        # output_filename = "output.json"
        # write_text_file(output_filename, reply)
        

        #### ĐIỀN VÀO TEMPLATE VỚI CÁC GIÁ TRỊ CHÍNH XÁC ĐƯỢC TRÍCH XUẤT RA TỪ HIERARCHICAL JSON ###
        ############################################################################################
        ############################################################################################
        
        # Đọc thông tin template từ file json
        template_content = template

        text_content2 = reply + "\nTEMPLATE: \n"+template_content + "\nRESPONSE: "
        # Khởi tạo một danh sách các tin nhắn với nội dung ban đầu
        messages2 = [{"role": "assistant", "content": text_content2}]
        
        # Thêm đầu vào của người dùng vào lịch sử cuộc trò chuyện
        messages2.append({"role": "user", "content": text_content2})
        
        # Gửi tin nhắn đến OpenAI và nhận phản hồi
        response2 = openai.ChatCompletion.create(
            # Model đã được fine tune để lấy giá trị chính xác từ hierarchical json để điền vào template.json
            model="ft:gpt-3.5-turbo-1106:personal::9QpAkz6z:ckpt-step-80",  
            messages=messages2,
            temperature=0,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        # Trích xuất câu trả lời từ phản hồi
        reply2 = response2.choices[0].message['content']

        # thêm thông tin vào file output.json để xem thử hoạt động 
        # output_filename = "output.json"
        # write_text_file(output_filename, reply2)

        # Hiển thị câu trả lời để xem độ chính xác 
        return {"reply": reply2}  #
    
    # Gặp lỗi sẽ hiện ra câu lệnh 
    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    uvicorn.run(app, port=3000, host='0.0.0.0')