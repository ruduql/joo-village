// 도토리 마을 멀티플레이 서버
// 게임 화면(public/index.html)을 보여 주고, 접속한 사람들끼리 위치·옷·채팅을 실시간으로 주고받아요.
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (req, res) => res.send('ok'));

const AREAS = new Set(['village', 'bakery', 'mart1', 'martB1', 'mart2', 'mart3']);
const WEAR_SLOTS = ['top', 'bottom', 'hat', 'neck', 'shoes', 'face', 'jewel', 'bag'];
const MAX_PLAYERS = 50;
const players = {};

const clean = (s, n) => String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, n);
const num = (v, d = 0) => (Number.isFinite(+v) ? Math.max(-500, Math.min(500, +v)) : d);
function cleanWear(w) {
  const o = {};
  if (w && typeof w === 'object') for (const k of WEAR_SLOTS) if (typeof w[k] === 'string') o[k] = w[k].slice(0, 20);
  return o;
}

io.on('connection', (sock) => {
  sock.on('join', (d = {}) => {
    if (players[sock.id]) return;
    if (Object.keys(players).length >= MAX_PLAYERS) {
      sock.emit('chat', { id: 'sys', name: '알림', text: '지금은 마을이 꽉 찼어요. 잠시 후 다시 와 주세요.' });
      return sock.disconnect(true);
    }
    players[sock.id] = {
      id: sock.id,
      name: clean(d.name, 10) || '고양이',
      fur: num(d.fur, 0xf3e3c8),
      wear: cleanWear(d.wear),
      area: AREAS.has(d.area) ? d.area : 'village',
      x: num(d.x), z: num(d.z), a: num(d.a), m: false,
    };
    io.emit('chat', { id: 'sys', name: '알림', text: `${players[sock.id].name} 님이 마을에 왔어요` });
  });

  sock.on('state', (d = {}) => {
    const p = players[sock.id];
    if (!p) return;
    if (AREAS.has(d.area)) p.area = d.area;
    p.x = num(d.x, p.x); p.z = num(d.z, p.z); p.a = num(d.a, p.a); p.m = !!d.m;
  });

  sock.on('wear', (w) => { const p = players[sock.id]; if (p) p.wear = cleanWear(w); });

  sock.on('chat', (t) => {
    const p = players[sock.id];
    if (!p) return;
    const now = Date.now();
    if (now - (p.lastChat || 0) < 700) return; // 도배 방지
    p.lastChat = now;
    const text = clean(t, 60);
    if (text) io.emit('chat', { id: sock.id, name: p.name, text });
  });

  sock.on('disconnect', () => {
    const p = players[sock.id];
    delete players[sock.id];
    if (p) io.emit('chat', { id: 'sys', name: '알림', text: `${p.name} 님이 집에 갔어요` });
  });
});

// 0.1초마다 모든 사람의 위치를 모두에게 보내요.
setInterval(() => {
  const list = Object.values(players).map(({ lastChat, ...p }) => p);
  io.emit('snap', list);
}, 100);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`도토리 마을 서버 실행 중: http://localhost:${PORT}`));
