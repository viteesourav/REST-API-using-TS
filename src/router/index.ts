import express from 'express';
const router = express.Router();

import authentication from './authentication'
import users from './users'

//This is type of export defualt, an anynomous Function that holds all the Routers.
export default (): express.Router => {

    authentication(router);
    users(router);
    
    return router;
}