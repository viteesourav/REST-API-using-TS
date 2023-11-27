import crypto from 'crypto';

const SECRET = 'This-is-my-secret-project-435634563273537';

//A Random 128 Bytes Bas64 generator...
const random = () => crypto.randomBytes(128).toString('base64');

//Generate Hashed Password.
const authentication = (salt:string, password:string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

export {
    random,
    authentication,
}