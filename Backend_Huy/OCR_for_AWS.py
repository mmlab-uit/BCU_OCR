from difflib import SequenceMatcher
import pandas as pd
import cv2
import random,string,os,re,sys
import numpy as np
import math,imutils
from PIL import Image
import torch
from requests_toolbelt.multipart import decoder

import json
import base64
import boto3
from io import BytesIO

import detectron2
from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg



device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
file_path = os.path.dirname(os.path.abspath(__file__))
s3= boto3.client('s3')



# Background Removal
cfg = get_cfg()
cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
cfg.MODEL.ROI_HEADS.NUM_CLASSES = 2
cfg.OUTPUT_DIR=file_path 
cfg.MODEL.WEIGHTS = os.path.join(cfg.OUTPUT_DIR,"models","detectron2.pth")
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.93

cfg.MODEL.DEVICE=str(device) 

predictor = DefaultPredictor(cfg)


def Receipt_Segmentation(image):
    outputs=predictor(image)
    masks=outputs['instances'].pred_masks.cpu()
    objs_images=list(outputs['instances'].pred_boxes)

    OBJ=[]
    for i in range(masks.shape[0]):
        temp=objs_images[i].cpu().numpy()

        image_crop=image[int(temp[1]):int(temp[3]),int(temp[0]):int(temp[2])]
        mask_crop=masks[i][int(temp[1]):int(temp[3]),int(temp[0]):int(temp[2])]

        H,W=mask_crop.shape

        mask_crop.reshape(-1)
        image_crop.reshape(-1,3)
        image_crop[mask_crop==0]=[0,0,0]

        image_crop.reshape(H,W,3)
        OBJ.append(image_crop)

    return OBJ



# Text Detection

os.chdir(os.path.join(file_path, 'mmocr'))
sys.path.append(os.path.join(file_path, 'mmocr'))
from mmocr.apis import TextDetInferencer

checkpoint = os.path.join(file_path,"models","textdet_weight.pth")
cfg_file = 'configs/textdet/dbnetpp/dbnetpp_resnet50-dcnv2_fpnc_1200e_icdar2015.py'


def CustomSort(val):
    return val[0]


def Text_Detection(img):
    os.chdir(os.path.join(file_path, 'mmocr'))

    ocr = TextDetInferencer(cfg_file, checkpoint)

    # Find the longest bounding box
    result_1 = ocr(img)['predictions']
    ma = -1e9
    for i in result_1[0]['polygons']:
        cur = [(i[0], i[1]), (i[2], i[3]), (i[4], i[5]), (i[6], i[7])]
        list = [(cur[0][0], 0), (cur[1][0], 1), (cur[2][0], 2), (cur[3][0], 3)]
        list.sort(key=CustomSort)
        if list[1][1] == 1:
            cur[0], cur[1], cur[2], cur[3] = cur[1], cur[2], cur[3], cur[0]

        if (cur[0][0]-cur[2][0])**2+(cur[0][1]-cur[2][1])**2 > ma:
            ma = (cur[0][0]-cur[2][0])**2+(cur[0][1]-cur[2][1])**2
            longest = cur

    # Find the correct angle and Rotate Image
    temp = (longest[2][0]-longest[1][0])/np.sqrt((longest[1]
                                                  [0]-longest[2][0])**2+(longest[1][1]-longest[2][1])**2)
    angle = math.degrees(math.acos(temp))
    val = angle-90
    rotated = imutils.rotate(img, angle=val)

    # Text Detect the rotated image
    result_2 = ocr(rotated)['predictions']

    return rotated, result_2[0]['polygons']


# Text Recognition
os.chdir(os.path.join(file_path,'vietocr'))
sys.path.append(os.path.join(file_path, 'vietocr'))
from vietocr.tool.config import Cfg
from vietocr.tool.predictor import Predictor


config=Cfg.load_config_from_file('weight/config.yml')
config['pretrained']=config['weights']=os.path.join(file_path,"models","textreg_weight.pth")

config['device'] = str(device) 
detector = Predictor(config)


def Text_Recognition(img, bbox):
    os.chdir(os.path.join(file_path,'vietocr'))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(img)

    output = []
    for i in bbox:
        x_min = min(i[0], i[2], i[4], i[6])-5
        y_min = min(i[1], i[3], i[5], i[7])-5
        x_max = max(i[0], i[2], i[4], i[6])+5
        y_max = max(i[1], i[3], i[5], i[7])+5
        crop = img.crop((x_min, y_min, x_max, y_max))
        output.append(detector.predict(crop))
    return output


# Word Correction

os.chdir(file_path)
df = pd.read_excel('custom-dictionary1.xlsx')
common_words = [df['text'].values[i].lower().strip()
                for i in range(len(df['text'].values))]


def Word_Correction(array_text, threshold):

    # Compute Similarity
    def Compute_Similarity(s1, s2):

        def map_similar_chars(text):
            mapping = {
                'a': 'a', 'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
                'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
                'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
                'e': 'e', 'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
                'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
                'i': 'i', 'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i', '1': 'i',
                'o': 'o', 'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'O': 'o',
                'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
                'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
                'u': 'u', 'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
                'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
                'y': 'y', 'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y', 'v': 'y',
                'n': 'n', 'r': 'n',
                'm': 'n',
                'c': 'c', 'g': 'c'
            }
            return ''.join(mapping.get(char, char) for char in text)

        similarity1 = {
            'a': [['a', 'á', 'à', 'ả', 'ã', 'ạ'], ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'], ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ']],
            'e': [['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'], ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ']],
            'o': [['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'], ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'], ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ']],
            'u': [['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'], ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự']],
            'i': [['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị']],
            'y': [['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ']],
        }

        similarity2 = {
            '1': {'i': 0.65, 'í': 0.6, 'ì': 0.6, 'ỉ': 0.6, 'ĩ': 0.6, 'ị': 0.6,
                  'I': 68, 'Í': 0.66, 'Ì': 0.66, 'Ỉ': 0.66, 'Ĩ': 0.66, 'Ị': 0.66},

            '0': {'o': 0.65, 'ó': 0.63, 'ò': 0.63, 'ỏ': 0.63, 'õ': 0.63, 'ọ': 0.63,
                  'ô': 0.63, 'ố': 0.6, 'ồ': 0.6, 'ổ': 0.6, 'ỗ': 0.6, 'ộ': 0.6,
                  'ơ': 0.63, 'ớ': 0.6, 'ờ': 0.6, 'ở': 0.6, 'ỡ': 0.6, 'ợ': 0.6,
                  'O': 0.85, 'Ó': 0.83, 'Ò': 0.83, 'Ỏ': 0.83, 'Õ': 0.83, 'Ọ': 0.83,
                  'Ô': 0.83, 'Ố': 0.8, 'Ồ': 0.8, 'Ổ': 0.8, 'Ỗ': 0.8, 'Ộ': 0.8,
                  'Ơ': 0.83, 'Ớ': 0.8, 'Ờ': 0.8, 'Ở': 0.8, 'Ỡ': 0.8, 'Ợ': 0.8},
            'd': {'đ': 0.8},
            'D': {'Đ': 0.7},
            'C': {'G': 0.2},
            'n': {'r': 0.6, 'm': 0.5},
            'm': {'r': 0.2},
            'N': {'M': 0.45},
            'y': {'v': 0.55},
            'Y': {'V': 0.55}
        }

        def Find_Common_Key(w1, w2):
            for key, value_lists in similarity1.items():
                idx1, idx2 = None, None
                for i in range(len(value_lists)):
                    if w1 in value_lists[i]:
                        idx1 = i
                    if w2 in value_lists[i]:
                        idx2 = i
                if idx1 != (None) and idx2 != (None):
                    return key, idx1, idx2
            return None, None, None

        s1_lower = s1.lower()

        mapped_t1 = map_similar_chars(s1_lower)
        mapped_t2 = map_similar_chars(s2)
        sm = SequenceMatcher(None, mapped_t1, mapped_t2)

        blocks = sm.get_matching_blocks()
        minus = 0

        for x, y, length in blocks:
            if length == 0:
                continue
            for k in range(length):
                char1 = s1_lower[x+k]
                char2 = s2[y+k]
                if char1.isupper():
                    char2 = char2.upper()

                if char1 == char2:
                    continue

                common_key, index1, index2 = Find_Common_Key(
                    char1.lower(), char2.lower())

                if common_key != None:
                    if index1 == index2:
                        minus += 0.2*2
                    else:
                        minus += 0.3*2
                elif char1 in similarity2 and char2 in similarity2[char1]:
                    minus += (1-similarity2[char1][char2])*2
                elif char2 in similarity2 and char1 in similarity2[char2]:
                    minus += (1-similarity2[char2][char1])*2

        return sm.ratio()-minus/(len(s1)+len(s2))

    # DP
    A = np.resize(-1, (len(array_text), len(array_text))).astype('float32')
    F = np.resize(-1, (len(array_text), len(array_text))).astype('float32')
    B = np.resize(-1, (len(array_text), len(array_text)))

    def Compute(x, y):
        if F[x][y] != -1:
            return F[x][y]
        ma_score = 0
        cnt = -1
        len1 = y-x+1
        for word in common_words:
            cnt += 1
            temp = word.split(' ')
            len2 = len(temp)

            # if len1!=len2: continue # Optinial Stop checking if two strings don't have the same length

            score = Compute_Similarity(" ".join(array_text[x:y+1]), word)
            # score=SequenceMatcher(None," ".join(array_text[x:y+1]),word).ratio()
            if score > threshold:
                # score=score*min(len1,len2)/max(len1,len2) # Optional: Add punishment if length of words don't match
                if score > ma_score:
                    B[x][y] = cnt
                    ma_score = score

        F[x][y] = ma_score*(y-x+1)
        return F[x][y]

    def Memoization(x, y):
        if A[x][y] != -1:
            return A[x][y]
        ma = Compute(x, y)
        if x == y:
            A[x][y] = ma
            return A[x][y]
        for i in range(x, y):
            ma = max(ma, Memoization(x, i)+Memoization(i+1, y))
        A[x][y] = ma
        return A[x][y]

    out = Memoization(0, len(array_text)-1)

    # Backtrack
    Dict = {}

    def Trace(x, y):
        if F[x][y] == A[x][y]:
            if F[x][y] == 0:
                return
            Dict[x] = (y, common_words[B[x][y]])
            return
        for i in range(x, y):
            if A[x][y] == A[x][i]+A[i+1][y]:
                Trace(x, i)
                Trace(i+1, y)
                break

    Trace(0, len(array_text)-1)

    # Add
    edited = ''
    iter = 0
    while iter < len(array_text):
        if iter in Dict:
            edited += Dict[iter][1]+' '
            iter = Dict[iter][0]+1
        else:
            edited += array_text[iter]+' '
            iter += 1
    return edited.strip()


def Perform_Text_Correction(in_txt):
    out_txt = []
    for j in in_txt:
        single_out = []
        for text in j:
            text = re.split(r'([,;.!?:\-\"\'\(\)])', text)
            subtext = [i.strip() for i in text if i]
            modified_txt = ''
            for z in subtext:
                arr_txt = z.split(' ')
                threshold = 0.88
                modified_txt += Word_Correction(arr_txt, threshold)
            single_out.append(modified_txt.lower())
        out_txt.append(single_out)
    return out_txt




def generate_random_string(length=12):
    letters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(letters) for i in range(length))
    return random_string


def Vietnamese_OCR(event,context):
    body = base64.b64decode(event['body'])
    content_type = event['headers']['content-type']
    multipart_data = decoder.MultipartDecoder(body, content_type)

    image_data = None
    allow_background_removal = None
    allow_text_correction = None
    for part in multipart_data.parts:
        content_disposition = part.headers[b'Content-Disposition'].decode()
        if 'name="image"' in content_disposition:
            image_data = part.content
        elif 'name="background_removal"' in content_disposition:
            allow_background_removal = int(part.content.decode('utf-8'))
        elif 'name="text_correction"' in content_disposition:
            allow_text_correction = int(part.content.decode('utf-8'))


    random_str=generate_random_string()


    s3.put_object(Bucket='ocr-query-image',Key=random_str+'.jpg',Body=image_data)

    response=s3.get_object(Bucket='ocr-query-image',Key=random_str+'.jpg')
    file_content=response['Body'].read()
    buf=BytesIO(file_content)
    image = Image.open(buf).convert('RGB')
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


    txt_reg = []
    mul_bbox = []
    mul_rotated = []

    if allow_background_removal==True: OBJECT=Receipt_Segmentation(image)
    else: OBJECT = [image]

    for obj in OBJECT:
        rotated, bbox = Text_Detection(obj)
        temp = Text_Recognition(rotated, bbox)
        mul_bbox.append(bbox)
        mul_rotated.append(rotated)
        txt_reg.append(temp)

    os.chdir(file_path)
    img_path_array = []
    for i in range(len(mul_rotated)):
        tmp = random_str+'_'+str(i)+'.jpg'
        img_path_array.append(tmp)

        cur_pil_img=Image.fromarray(cv2.cvtColor(mul_rotated[i], cv2.COLOR_BGR2RGB))
        buffer=BytesIO()
        cur_pil_img.save(buffer,'JPEG')
        buffer.seek(0)
        s3.put_object(Bucket='ocr-query-image',Key=tmp,Body=buffer)

    # Perform correction
    if allow_text_correction == True:
        txt_reg = Perform_Text_Correction(txt_reg)

    event['result']={'bounding_box': mul_bbox, 'text': txt_reg, 'img_path': img_path_array}
    return json.dumps(event)


