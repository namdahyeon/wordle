from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

answer='BRAVE'

@app.get('/answer')
def get_answer():
   return answer

app.mount("/", StaticFiles(directory="static",html=True), name="static")
# 'html=True' 추가해주면 경로가 깔끔해짐.


# 파라미터 입력 예시
# http://127.0.0.1:8000/items?skip=1&limit=2   : 1개 스킵하고 2개 뽑아주세요

# pip install uvicorn[standard]   : 파이썬 설치 (스탠다드 버전)
# uvicorn main:app --reload   : 터미널 입력해서 서버 실행

# http://127.0.0.1:8000/docs#/default/read_item_items_get 에서 docs 확인 가능