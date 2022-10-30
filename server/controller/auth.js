import User from '../models/user'
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;

    //validation
    if(!name) return res.status(400).send('Name is required');
    if(!password || password.length < 6) return res.status(400).send('Password is required and should be at least 6 characters');
    
    let userExists = await User.findOne({email:email}).exec()

    if(userExists) return res.status(400).send('Email already taken');

    //register
    const user = new User(req.body)
    try{ 
        await user.save();
        console.log('USER CREATED', user);
        return res.json({ok: true});
    }
    catch (err) { 
        console.log('CREATE USER FAIL', err);
        return res.status(400).send('Error. Try again');
    }
};

export const login = async (req, res) => {
    //console.log(req.body);
    const {email, password} = req.body
    try{
        // check if the user with that email exists
        let user = await User.findOne({email:email}).exec();
        //console.log("USER EXISTS", user);
        if(!user) res.status(400).send('USER WITH THAT EMAIL NOT FOUND');
        // compare password
        user.comparePassword(password, (err, match)=> {
            console.log('COMPARE PASSWORD IN LOGIN ERR', err)
            if(!match || err) return res.status(400).send('WRONG PASSWORD');
            //GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT
            let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            res.json({ 
                token, 
                user:{
                _id: user._id,
                name: user.name, 
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            } });
        });
    } catch (err){ 
        console.log('LOGIN ERROR', err);
        res.status(400).send("Signin Failed"); 
    }
}