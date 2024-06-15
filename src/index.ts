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
  const query = `    
    SELECT m.id, m.title, m.eng_title, m.year, m.country, m.m_type, m.status, m.company, g.genre, d.name
    FROM movies m
    LEFT JOIN movie_director md ON m.id = md.movie_id
    LEFT JOIN genres g ON m.id = g.movie_id
    LEFT JOIN directors d ON md.director_id = d.id
    ORDER BY m.id`;
  conn.query(query, function (err: any, result: any) {
    if (err) {
      console.log("query is not excuted: " + err);
      return;
    }

    res.send(result);
  });
});

app.get("/search-movies", (req: Request, res: Response, next: NextFunction) => {
  const { movieTitle, directorName, fromYear, toYear } = req.query;

  let isNull = false;
  let query = `
      SELECT m.id, m.title, m.eng_title, m.year, m.country, m.m_type, m.status, m.company, g.genre, d.name
      FROM movies m
      LEFT JOIN movie_director md ON m.id = md.movie_id
      LEFT JOIN genres g ON m.id = g.movie_id
      LEFT JOIN directors d ON md.director_id = d.id
      WHERE 1=1
    `;
  if (
    !movieTitle &&
    !directorName &&
    fromYear === "전체 선택" &&
    toYear === "전체 선택"
  ) {
    query = `    
      SELECT m.id, m.title, m.eng_title, m.year, m.country, m.m_type, m.status, m.company, g.genre, d.name
      FROM movies m
      LEFT JOIN movie_director md ON m.id = md.movie_id
      LEFT JOIN genres g ON m.id = g.movie_id
      LEFT JOIN directors d ON md.director_id = d.id
      ORDER BY m.id`;
    isNull = true;
  }

  let queryParams: any[] = [];

  if (movieTitle) {
    query += " AND m.title LIKE ?";
    queryParams.push(`%${movieTitle}%`);
  }

  if (directorName) {
    query += " AND d.name LIKE ?";
    queryParams.push(`%${directorName}%`);
  }

  if (fromYear !== "전체 선택" && toYear !== "전체 선택") {
    query += " AND m.year BETWEEN ? AND ?";
    queryParams.push(fromYear, toYear);
  } else if (fromYear !== "전체 선택") {
    query += " AND m.year >= ?";
    queryParams.push(fromYear);
  } else if (toYear !== "전체 선택") {
    query += " AND m.year <= ?";
    queryParams.push(toYear);
  }

  if (!isNull) query += ` ORDER BY m.id`;

  conn.query(query, queryParams, function (err: any, result: any) {
    if (err) {
      console.log("Query is not executed: " + err);
      res.status(500).send("Error executing query");
      return;
    }
    res.send(result);
  });
});

app.use(express.static(path.join(__dirname, "./client/build")));

app.listen(PORT, () => {
  console.log(`
        ##############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        ##############################################
    `);
});
