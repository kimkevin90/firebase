const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config')

module.exports = {
    Mutation: {
        async register(_, 
            { 
                registerInput : {username, email, password, confirmPassword }
            }, 
            ) {
            // TODO: Validate user data
            // TODO: Make sure user doesnt already exist
                const user = await User.findOne({ username });
                if(user) {
                    throw new UserInputError('Username is taken', {
                        error: {
                            username: 'this username is taken'
                        }
                    })
                }

            // TODO: hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });
            
            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'});

            return {
                ...res._doc,
                id: res.id,
                token
            }
        }
    }
}