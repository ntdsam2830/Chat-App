import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";

//Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.use("/api/status", (req, res) => {
  res.send({ message: "Server is running!" });
});

//Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
