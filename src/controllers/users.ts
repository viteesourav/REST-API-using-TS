import express from 'express';
import { deleteUserById, getAllUsers, getUserById } from '../db/users';

//contoller to fetch all Users data...
const fetchAllUsers = async(req:express.Request, res:express.Response) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users).end();
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Error While FetchAllUsers'});
    }
};

//Contoller to deleteUser Data...
const deleteUser = async(req:express.Request, res:express.Response) => {
    try {
        const {id} = req.params;        
        //fetch the userData based on id...
        const userInfo = await deleteUserById(id);

        return res.status(200).json(userInfo).end();

    }catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Error While FetchAllUsers'});
    }
}

//contoller to update username...
const updateUser = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        //fetch req param and body..
        const {id} = req.params;
        const {username} = req.body;

        //Validate the payload...
        if(!id || !username) {
            return res.status(404).json({message: 'Bad Request, Check and try again'});
        }

        //fetch userInformation, then update the username and save it.
        const userInfo = await getUserById(id);
        userInfo.username = username;
        userInfo.save();

        return res.status(200).json(userInfo).end();

    } catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Error While UpdatingUserInfo'});
    }
}

export {
    fetchAllUsers,
    deleteUser,
    updateUser,
}