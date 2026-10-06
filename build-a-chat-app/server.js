import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
  const files = {
    "/": { path: "./public/index.html", contentType: "text/html" },
    "/index.html": { path: "./public/index.html", contentType: "text/html" },
    "/script.js": {
      path: "./public/script.js",
      contentType: "text/javascript",
    },
  };
  const file = files[req.url];
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }
  fs.readFile(file.path, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": file.contentType });
    res.end(data);
  });
});

// 1. Fixed lowercase { server }
const wss = new WebSocketServer({ server });

// 2. All socket event listeners MUST live inside connection
wss.on('connection', (socket, req) => {
  // Parse username correctly
  const username = new URL(req.url, "http://localhost").searchParams.get("username");

  // Broadcast "joined" message to all clients on connect
  const joinPayload = JSON.stringify({ type: 'system', text: `${username} joined` });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(joinPayload);
    }
  });

  // Handle incoming chat messages
  socket.on('message', (data) => {
    const { username: msgUser, text } = JSON.parse(data);
    const chatPayload = JSON.stringify({ type: 'chat', username: msgUser, text });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(chatPayload);
      }
    });
  });

  // Handle disconnects
  socket.on('close', () => {
    const leavePayload = JSON.stringify({
      type: 'system',
      text: `${username} left`
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(leavePayload);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});