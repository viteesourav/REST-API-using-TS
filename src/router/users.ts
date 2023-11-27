import express from 'express';
import { deleteUser, fetchAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middleware';

export default (router: express.Router) => {
    //Fetch all users Route...
    router.get('/users', isAuthenticated, fetchAllUsers);

    //Delete user Route...[check if user loggedIn and if he is Authorized to perform any action]
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);

    //Update user Route [patch update as we will just update username]
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
}