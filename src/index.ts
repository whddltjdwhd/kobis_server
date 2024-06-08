import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors"; // cors 미들웨어를 가져옵니다.
const PORT = 8000;

const bodyParser = require("body-parser");
const app = express();
const db = require("./mysql.ts");
const conn = db.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // cors 미들웨어를 추가합니다.

app.set("port", process.env.PORT || 8000); // 포트 설정
app.set("host", process.env.HOST || "0.0.0.0"); // 아이피 설정

app.get("/movies", (req: Request, res: Response, next: NextFunction) => {
  const query = "select id, title, year from movie";
  conn.query(query, function (err: any, result: any) {
    if (err) {
      console.log("query is not excuted: " + err);
      return;
    }

    res.send(result);
  });
});

app.use(express.static(path.join(__dirname, "./client/build")));

app.listen(PORT, () => {
  console.log(`
        #############################################
        🛡️ Server listening on port: ${PORT} 🛡️
        #############################################  
    `);
});
