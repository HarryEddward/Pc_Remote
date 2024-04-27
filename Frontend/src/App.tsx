import React, { useState, useEffect } from "react";


function App() {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [ws, setWs] = useState(null);
  const [wsClick, setWsClick] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Establecer la conexión WebSocket
    const socketCoordenates = new WebSocket("ws://192.168.1.135:8010/ws");

    // Evento de apertura de la conexión WebSocket
    socketCoordenates.onopen = () => {
      console.log("WebSocket Connected");
      setWs(socketCoordenates);
    };

    // Evento de recepción de mensajes
    socketCoordenates.onmessage = (event) => {
      setReceivedMessage(event.data);
    };

    // Evento de cierre de la conexión WebSocket
    socketCoordenates.onclose = () => {
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

  useEffect(() => {
    // Establecer la conexión WebSocket
    const socketClick = new WebSocket("ws://192.168.1.135:8000/click");

    // Evento de apertura de la conexión WebSocket
    socketClick.onopen = () => {
      console.log("WebSocket Connected");
      setWsClick(socketClick);
    };

    // Evento de recepción de mensajes
    socketClick.onmessage = (event) => {
      setReceivedMessage(event.data);
    };

    // Evento de cierre de la conexión WebSocket
    socketClick.onclose = () => {
      console.log("WebSocket Disconnected");
      setWsClick(null);
    };

    // Limpieza al desmontar el componente
    return () => {
      if (wsClick) {
        wsClick.close();
      }
    };
  }, [])

  useEffect(() => {
    const handleClick = () => {

      if (wsClick) {
        wsClick.send("click")
      }
    };

    // Agregar el event listener al documento
    document.addEventListener("click", handleClick);

    // Limpiar el event listener al desmontar el componente
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [wsClick]); // Se ejecuta solo una vez al montar el componente

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
      <div>

    </div>
      <button onClick={sendMessage}>Send</button>
      <p>Received message: {receivedMessage}</p>
    </div>
  );
}

export default App;
