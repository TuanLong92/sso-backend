require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import configCors from "./config/cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import connection from "./config/connectDB";
import { configPassport } from './controller/passportController';
import configSessions from "./config/session";
import flash from 'connect-flash';
import configLoginWithGoogle from './controller/social/GoogleController';
import configLoginWithFacebook from './controller/social/FacebookController';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(flash());
//config cors
configCors(app);

//config view engine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie -parser
app.use(cookieParser());

configSessions(app);
//test connection db
//connection();


//init web routes
initWebRoutes(app);
initApiRoutes(app);

//req => middleware => res
app.use((req, res) => {
    return res.send('404 not found')
})

configPassport();
configLoginWithGoogle();
configLoginWithFacebook();
app.listen(PORT, () => {
    console.log(">>> JWT Backend is running on the port = " + PORT);
})