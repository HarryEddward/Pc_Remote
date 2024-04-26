from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

import pyautogui
import asyncio


app = FastAPI()

'''
async def move_mouse(x: int, y: int) -> None:
    pyautogui.moveTo(x, y)
'''

from fastapi import FastAPI, WebSocket

app = FastAPI()

# Almacenamiento temporal de conexiones de WebSocket
websocket_connections = []

# Ruta de conexión WebSocket# Ruta de conexión WebSocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.append(websocket)
    try:
        while True:
            # Espera mensajes del cliente
            data = await websocket.receive_text()
            print(data.split(", "))  # Aquí deberías enviar los datos a todos los clientes, no solo imprimirlos
            # Reenvía el mensaje a todos los clientes conectados
            for connection in websocket_connections:
                await connection.send_text(data)
    finally:
        # Elimina la conexión cuando se cierra
        websocket_connections.remove(websocket)


'''
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

    except WebSocketDisconnect:
        pass'''