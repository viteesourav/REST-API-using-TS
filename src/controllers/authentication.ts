import express from "express";
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helper'

//Register the User Controller...
const register = async(req:express.Request, res:express.Response) => {
    try {
        const {email, password, username} = req.body;
        //Field Validation to see if any of this data is missing ?
        if(!email || !password || !username) {
            return res.status(400).json({errorMsg: 'Field Validation Failed'}); //Bad Request Status send...
        }
        //Check if the user Already Exist ?
        const isUserExisting = await getUserByEmail(email);
        if(isUserExisting) {
            return res.status(400).json({errorMsg: 'User With same EmailID already Exist'}); //Bad Request as User already Exist.
        }
        //creating a new User...
        const salt = random();
        const newUser = await createUser({
            email,
            username,
            authentication: {
                password: authentication(salt, password),  //Hash the password...
                salt,
            }
        })
        return res.status(200).json(newUser).end();
    } catch(error) {
        console.log(error);
        return res.status(400).json({errorMsg: 'Some Error occured' }); //BAD Request Status Sent...
    }
};

//DoLogin Controller...
const doLogin = async(req:express.Request, res:express.Response) => {
    try{
        const {email, password} = req.body;
        //Data Validation for the incoming payload..
        if(!email || !password) {
            return res.status(400).json({errorMsg: 'Field Validation Failed'});
        }
        //If the Email Exist's in DB...[NOTE: adding select fetches the data for pass and salt from the db]
        const userInfo = await getUserByEmail(email).select('+authentication.password +authentication.salt');
        if(!userInfo) {
            return res.status(400).json({errorMsg: 'User Doesn\'t exists'});
        }
        //validate password...
        const expectedHashedPass = authentication(userInfo.authentication.salt, password);
        if(expectedHashedPass !== userInfo.authentication.password) {
            return res.status(403).json({message: "Either Email or Password is not Entered correctly"});
        }

        //Update the sessionToken in the DB...
        const salt = random();
        userInfo.authentication.sessionToken = authentication(salt, userInfo._id.toString());
        
        await userInfo.save();

        //update the Cookie information...[store session Token in Cookie]
        res.cookie('My-Cookie', userInfo.authentication.sessionToken, {domain: 'localhost', path: '/'});

        return res.status(200).json(userInfo).end();
    }catch(error) {
        console.log(error);
        return res.status(400).json({errorMsg: 'Some Error occured'});
    }
}

export {
    register,
    doLogin,
}