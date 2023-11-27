import { getUserBySessionToken } from '../db/users';
import express from 'express';

//merge here recursively merge Object Content.
import { get, merge } from 'lodash';

//Fucntion to check if the user is Authenticated or not ?
export const isAuthenticated = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        //Fetch the session Token, check is any user exist with that token in db ?
        const sessionToken = req.cookies['My-Cookie'];

        if(!sessionToken)
            return res.status(403).json({message: 'Session Error, Try Login Again'});

        const isUserSessionExists = await getUserBySessionToken(sessionToken);

        if(!isUserSessionExists)
            return res.status(401).json({message: 'Session Error, Session Expired'});

        merge(req, {identity: isUserSessionExists}); //add the session info in req body

        next();  //If all above validation passed, call the next middleware...

    } catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Error While Validating User Middleware'});
    }
}

//Fucntion to check if the LoggedIn Owner only peforming Actions or not..
export const isOwner = (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try{
        //fetch the id coming in param...
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        //Validate if we dont have user details in req or the user is performing action on a different id.
        if(!currentUserId || id !== currentUserId.toString()) {
            return res.status(403).json({message: 'User not allowed to Perform this Operation'});
        }

        next();

    }catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Error While Validating Owner Middleware'});
    }
}