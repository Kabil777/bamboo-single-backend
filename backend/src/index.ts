import { configDotenv } from "dotenv";
import { HttpServer } from "./http/httpServer.js";

configDotenv();

const http = new HttpServer();
const port = Number(process.env.PORT ?? 8092);
http.listen(port);
