import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import moongoose from 'mongoose';
import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

//Connection to DB..
const MONGO_LOCAL_DB = 'mongodb://127.0.0.1:27017/rest-api-backend-ts';

moongoose.Promise = Promise;
moongoose.connect(MONGO_LOCAL_DB).then(() => console.log('DB Connected Successfully'));
moongoose.connection.on('error', (error:Error) => {
    console.log('MongoDB Connection Broken', error);
})

//Default home Test Route...
app.get('/', (req:express.Request,res:express.Response)=> {
    res.send('Hey There! Welcome, to your First Typescript Server');
})

//Our User Routes are In here...
app.use('/', router());


//Start the Server at 8080
app.listen(8080, ()=> {
    console.log('The Server is live at Port: 8080');
})