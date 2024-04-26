import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [ws, setWs] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Establecer la conexión WebSocket
    const socket = new WebSocket("ws://localhost:8000/ws");

    // Evento de apertura de la conexión WebSocket
    socket.onopen = () => {
      console.log("WebSocket Connected");
      setWs(socket);
    };

    // Evento de recepción de mensajes
    socket.onmessage = (event) => {
      setReceivedMessage(event.data);
    };

    // Evento de cierre de la conexión WebSocket
    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      setWs(null);
    };

    // Limpieza al desmontar el componente
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // Array vacío indica que el efecto se ejecuta solo una vez al montar el componente

  // Función para enviar mensajes
  const sendMessage = () => {
    if (ws) {
      ws.send(message);
      setMessage("");
    }
  };

  const getMousePosition = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePosition({ x, y });
    // Envía las coordenadas del mouse al WebSocket
    if (ws) {
      console.log('hols')
      ws.send(x, y);
    }
  };

  // Agregar un event listener para el evento "mousemove"
  useEffect(() => {
    document.addEventListener("mousemove", getMousePosition);
    return () => {
      document.removeEventListener("mousemove", getMousePosition);
    };
  }, []);
  
  useEffect(() => {
    if (ws) {
      console.log('hols')
      ws.send(`${mousePosition.x}, ${mousePosition.y}`);
    }
  }, [mousePosition.x, mousePosition.y])
  

  console.log(mousePosition.x, mousePosition.y)
  return (
    <div className="App">
      <h1>WebSocket Example</h1>
      <h2>X: {mousePosition.x} Y: {mousePosition.y}</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <p>Received message: {receivedMessage}</p>
    </div>
  );
}

export default App;
