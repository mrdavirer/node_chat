const WebSocket = require('ws');
const readline = require('readline');

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];  
let usernames = []; 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

wss.on('connection', ws => {
  let username = null;

  ws.on('message', message => {
    if (Buffer.isBuffer(message)) {
      message = message.toString();
    }

    if (!username) {
      username = message;
      usernames.push(username);
      ws.send(`Добро пожаловать! ${usernames.length === 1 ? 'Вы первый в чате.' : 'В чате уже присутствуют: ' + usernames.join(', ')}`);

      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`${username} присоединился к чату.`);
        }
      });
    } else {
      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`${username}: ${message}`);
        }
      });
    }
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    usernames = usernames.filter(name => name !== username);

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${username} покинул чат.`);
      }
    });
  });

  clients.push(ws);
});

console.log('Сервер WebSocket запущен на ws://localhost:8080');
