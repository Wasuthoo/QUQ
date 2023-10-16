
// server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const e = require('express');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var Squeue = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09'];
var Sskip = [''];
var Sroom = [{ status: 'Ready', queue: '' }, { status: 'Ready', queue: '' }, { status: 'Ready', queue: '' }];

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  for (var i = 0; i < Sroom.length; i++) {
    if (Sroom[i].status === 'Ready') {
      Sroom[i].queue = Squeue[0];
      Sroom[i].status = 'calling';
      Squeue.shift();
    }
    // Send the current queue to the client when they connect
  ws.send(JSON.stringify({ queue: Squeue, room: Sroom, skip: Sskip }));
  }


  ws.on('message', (message) => {
    const { room, action } = JSON.parse(message);
    console.log(`Received action: ${action}, room: ${room}`);
    console.log(room);
    console.log(action);

    if (action === 'join') {
      Sroom[room].status = 'joined';
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ queue: Squeue, room: Sroom }));
        }
      });
    }
    if (action === 'reset') {
      Squeue = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09'];
      Sskip = [''];
      Sroom = [{ status: 'Ready', queue: '' }, { status: 'Ready', queue: '' }, { status: 'Ready', queue: '' }];
      for (var i = 0; i < Sroom.length; i++) {
        if (Sroom[i].status === 'Ready') {
          Sroom[i].queue = Squeue[0];
          Sroom[i].status = 'calling';
          Squeue.shift();
        }
      }
      
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ queue: Squeue, room: Sroom, skip: Sskip }));
        }
      });
    }

    if (action === 'skip') {
      Sroom[room].status = 'calling';
      
      if (Squeue.length > 0) {
        Sskip.push(Sroom[room].queue);
        Sroom[room].queue = Squeue[0];
        Squeue.shift();
      }
      else {
        Sskip.push(Sroom[room].queue);
        Sroom[room].queue = Sskip[0];
        Sskip.shift();
      }

      
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ queue: Squeue, room: Sroom, skip: Sskip }));
        }
      });
    }

    if (action === 'finish') {
      Sroom[room].status = 'calling';
      if (Squeue.length > 0) {
        Sroom[room].queue = Squeue[0];
        Squeue.shift();
      }
      else {
        Sroom[room].queue = Sskip[0];
        Sskip.shift();
      }
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ queue: Squeue, room: Sroom, skip: Sskip }));
        }
      });
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
