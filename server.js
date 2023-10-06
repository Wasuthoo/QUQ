
// server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const queue = [];
const room = [];

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send the current queue to the client when they connect
  ws.send(JSON.stringify(queue));

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    const nmessage = message.toString('utf-8');
    console.log(nmessage);

    // Add a new person to the queue
    if (nmessage === 'add') {
      const newPerson = `Person ${queue.length + 1}`;
      queue.push(newPerson);

      // Broadcast the updated queue to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(queue));
        }
      });
    }

    // Call the next person in the queue
    if (nmessage === 'call') {
      if (queue.length > 0) {
        const calledPerson = queue.shift();

        // Broadcast the updated queue and the called person to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ queue, calledPerson }));
          }
        });
      }
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(8000, () => {
  console.log('Server listening on http://localhost:8000');
});
