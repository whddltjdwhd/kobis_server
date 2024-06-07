import express, { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();

const users = [
  { id: 1, username: "user1" },
  { id: 2, username: "user2" },
  { id: 3, username: "user3" },
];

app.get("/user", (req: Request, res: Response, next: NextFunction) => {
  res.json(users);
});

app.use("/user", express.static(path.join(__dirname, "./client/build")));

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`
        #############################################
        🛡️ Server listening on port: ${PORT} 🛡️
        #############################################  
    `);
});
