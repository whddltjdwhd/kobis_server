import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors"; // cors 미들웨어를 가져옵니다.

const app = express();
app.use(cors()); // cors 미들웨어를 추가합니다.

const users = [
  { id: 1, username: "user1" },
  { id: 2, username: "user2" },
  { id: 3, username: "user3" },
];

// '/users' 경로로 사용자 데이터를 제공합니다.
app.get("/user", (req: Request, res: Response, next: NextFunction) => {
  res.json(users);
});

app.use(express.static(path.join(__dirname, "./client/build")));

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`
        #############################################
        🛡️ Server listening on port: ${PORT} 🛡️
        #############################################  
    `);
});
