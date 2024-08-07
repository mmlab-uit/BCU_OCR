FROM public.ecr.aws/lambda/python:3.9
RUN yum update -y && yum install -y \
    git \
    gcc \
    gcc-c++ \
    make \
    cmake \
    python3-devel \
    libffi-devel \
    openssl-devel \
    which \
    mesa-libGL \
    && yum clean all
ADD requirements.txt requirements.txt
RUN pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu121 --no-cache-dir
RUN pip install -r requirements.txt --no-cache-dir
COPY . .
CMD ["OCR_for_AWS.Vietnamese_OCR"]
