import uvloop
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import pyautogui

asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

app = FastAPI()
websocket_connections = set()
message_queue = asyncio.Queue(maxsize=100)

async def move_mouse(x: int, y: int) -> None:
    pyautogui.moveTo(x, y)

async def process_messages():
    while True:
        data_raw = await message_queue.get()
        while not message_queue.empty():
            data_raw = await message_queue.get()
        x, y = map(int, data_raw.split(","))
        await move_mouse(x, y)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(process_messages())

@app.get("/")
async def root():
    return "Hola"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.add(websocket)
    try:
        while True:
            data_raw = await websocket.receive_text()
            await message_queue.put(data_raw)
    except WebSocketDisconnect:
        pass
    finally:
        websocket_connections.remove(websocket)

@app.websocket("/click")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.add(websocket)
    try:
        while True:
            data_raw = await websocket.receive_text()
            if data_raw == "click":
                pyautogui.click()
    except WebSocketDisconnect:
        pass
    finally:
        websocket_connections.remove(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="192.168.1.135", port=8010)
