const WebSocket = require('ws');
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  rl.question('Введите ваше имя: ', (username) => {
    ws.send(username); 
    console.log(`Добро пожаловать, ${username}! Теперь вы можете отправлять сообщения.\n`);

    rl.on('line', (message) => {
      if (message.trim()) {
        ws.send(message);
      }
    });
  });
});

ws.on('message', (message) => {
  if (Buffer.isBuffer(message)) {
    message = message.toString();
  }
  console.log(message); 
});

ws.on('close', () => {
  console.log('Соединение с сервером закрыто.');
  process.exit();
});
