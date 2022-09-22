FROM python:3.10

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip setuptools wheel

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "flask", "--debug", "--app", "main", "run", "--host=0.0.0.0", "--port=3000"]

EXPOSE 3000
