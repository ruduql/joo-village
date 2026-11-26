# 도토리 마을 (멀티플레이 버전)

3D 힐링 마을 게임이에요. 같은 주소로 들어온 사람끼리 서로의 고양이가 보이고, 채팅을 할 수 있어요.

## 폴더 구성

```
dotori-online/
├─ server.js          멀티플레이 서버 (접속자 위치·옷·채팅 중계)
├─ package.json       필요한 라이브러리 목록
└─ public/
   └─ index.html      게임 화면 전체
```

## 내 컴퓨터에서 먼저 실행해 보기

1. [Node.js](https://nodejs.org) LTS 버전을 설치해요.
2. 이 폴더에서 터미널을 열고 아래를 입력해요.
   ```
   npm install
   npm start
   ```
3. 브라우저에서 `http://localhost:3000`에 들어가요.
4. 창을 하나 더 열어 같은 주소로 들어가면 두 고양이가 서로 보여요.

## 인터넷에 올리기 (Render, 무료)

1. **GitHub에 올리기**
   - github.com에서 새 저장소(repository)를 만들어요. 예: `dotori-village`
   - 이 폴더의 파일을 전부 올려요. `node_modules` 폴더는 올리지 않아요.
2. **Render에 연결하기**
   - render.com에 GitHub 계정으로 가입해요.
   - **New + → Web Service**를 누르고, 방금 만든 저장소를 골라요.
   - 설정은 이렇게 해요.
     - Runtime: **Node**
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: **Free**
   - **Create Web Service**를 누르면 몇 분 뒤 `https://dotori-village.onrender.com` 같은 주소가 생겨요.
3. 그 주소를 친구에게 보내면 같이 놀 수 있어요.

### 무료 요금제에서 알아 둘 점
- 15분 동안 아무도 안 들어오면 서버가 잠들어요. 다음 사람이 들어올 때 깨어나는 데 30초~1분쯤 걸려요.
- 항상 바로 켜져 있게 하려면 유료 요금제(월 7달러부터)를 쓰면 돼요.

## 다른 곳에 올리고 싶다면
Node.js가 돌아가는 곳이면 어디든 돼요. Railway, Fly.io, AWS Lightsail, 집 컴퓨터 등에서 똑같이 `npm install` 후 `npm start`로 실행하면 돼요. 서버는 `PORT` 환경 변수가 있으면 그 포트를 써요.

## 게임 안에서 공유되는 것 / 아닌 것
- **공유돼요**: 위치, 어느 가게·층에 있는지, 이름, 털 색, 입은 옷, 채팅
- **각자 따로예요**: 도토리 개수, 가방, 구매 기록 (각자 브라우저에 저장)

## 서버 기본 설정 (server.js)
- 최대 접속 인원: 50명 (`MAX_PLAYERS`)
- 이름 최대 10자, 채팅 최대 60자, 채팅은 0.7초에 한 번까지 (도배 방지)
