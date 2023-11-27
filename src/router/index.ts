import express from 'express';
const router = express.Router();

import authentication from './authentication'

//Okay this is new Syntax...
export default (): express.Router => {

    authentication(router);
    
    return router;
}