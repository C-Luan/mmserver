import express from "express";
import { router } from "./routes"


var porta = process.env.PORT_APP || 3000
const app = express()
var cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors('*', corsOptions));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS, PUT, DELETE")
  res.header(
    "Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
  );
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.json())
app.use(router)

app.listen(porta, () => console.log("Servidor rodando na porta " + porta))