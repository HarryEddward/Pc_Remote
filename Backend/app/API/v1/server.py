from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse

import pyautogui
import asyncio


app = FastAPI()


async def move_mouse(x: int, y: int) -> None:
    pyautogui.moveTo(x, y)


@app.websocket("/pointer")
async def root(websocket: WebSocket):

    await websocket.accept()
    try:
        while True:
            
            data_bytes = await websocket.receive_bytes()
            data_str = data_bytes.decode()
            
            parts = data_str.split(",")

            x = int(parts[0])
            y = int(parts[0])

            if x is not None and y is not None:
                
                asyncio.create_task(move_mouse(x, y))

    except Exception as e:

        print(f'error: {e}')
        '''
        En revision!
        return JSONResponse({

        }, )
        '''