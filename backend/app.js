import express from "express";
//import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";

import config from "./config";
import tv from "./routes/tv.routes";
import client from "./routes/client.routes";
import users from "./routes/users.routes";
import history from "./routes/history.routes";
import login from "./routes/login.routes";
import panel from "./routes/panel.routes";


const router = express.Router();
const app = express();

// Settings
app.set("port", config.port);
//Set View Engine to Ejs
app.set('view engine', 'ejs');
// Settings sessions
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

// Middlewares
// Authentication and Authorization Middleware

var adminAuth = function(req, res, next) {
  //Pueden acceder tanto administradores como empleados
  if (req.session.role === "admin"){
    return next();
  }
  else return res.render('pages/login');
};

var auth = function(req, res, next) {
  //Pueden acceder tanto administradores como empleados
  if (req.session.role === "employee" || req.session.role === "admin"){
    return next();
  }
  else return res.render('pages/login');
};

app.use(cors());
app.use('/public', express.static(__dirname+'/public'));
//app.use(morgan("dev"));//mostrar las solicitudes
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

// Routes
app.get("/", (req, res)=> res.render('pages/login'));
app.use("/panel", auth, panel); //modificar poner auth

app.use("/login", login);
app.use("/users",adminAuth, users);
app.use("/tv", auth, tv);
app.use("/client", auth, client);
app.use("/history", auth, history);

export default app;
