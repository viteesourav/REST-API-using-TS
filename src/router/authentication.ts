import express from 'express';
import { doLogin, register } from '../controllers/authentication'

export default (router: express.Router) => {
    
    router.post('/auth/register', register);

    router.get('/auth/login', doLogin);
}