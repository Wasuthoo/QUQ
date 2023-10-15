
// server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const queue = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09'];
const skip = [];
const room = [{status:'Ready',queue:''},{status:'Ready',queue:''},{status:'Ready',queue:''}];

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send the current queue to the client when they connect
  ws.send(JSON.stringify({ queue: queue, room: room ,skip: skip }));
  for (var i = 0; i < room.length; i++) {
    if (room[i].status === 'Ready') {
      room[i].status = queue[0];
      queue.shift();
    }
  }


  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    const { action, room } = parsedMessage;
    console.log(`Received action: ${action}, room: ${room}`);

    // Add a new person to the queue
    if (action === 'add') {
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
    if (action === 'call') {
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

    // Call the next person in the queue
    if (action === 'skip') {
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
