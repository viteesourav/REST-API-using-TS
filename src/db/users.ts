import mongoose from 'mongoose';

//DEfining the structure of User Collection Schema...
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    authentication: {
        password: {type: String, required: true, select: false}, //Select: false Avoid fetching this field while Quering database.
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    },
})

//Prepare a Model based on the Schema and export it...
const UserModel = mongoose.model('User', UserSchema);

//Define Actions on UserModel...[Defining CRUD Opertation on the stored data]
const getAllUsers = () => UserModel.find();
const getUserById = (id: string) => UserModel.findById(id);
const getUserByEmail = (email: string) => UserModel.findOne({email});
const getUserBySessionToken = (sessionToken:string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
const createUser = (values:Record<string, any>) => new UserModel(values).save().then(user=>user.toObject());
const deleteUserById = (id:string) => UserModel.findOneAndDelete({_id:id});
const updateUserById = (id:string, values:Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

//Export everything...
export {
    UserModel,
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserBySessionToken,
    createUser,
    deleteUserById,
    updateUserById
}



