const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator')

const User = require('../../models/User')

// @route       POST api/users
// @desc        Test route
// @access      Public
router.post('/', [
    check('name','Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valud email')
        .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({min:6})
] ,
    async (req,res) => {
        const errors= validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        
        const {name, email, password} = req.body

        try {
            let user = await User.findOne({email})
            // See if user exists
            if(user){
                res.status(400).json({errors: [{msg: 'User already exists'}]})
            }
            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })
            // Encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);
            
            await user.save()
            // Return jsonwebtoken
            
            const payload = {
                user: {
                    id: user.id
                }
            }
            console.log('jwtsinging')
            jwt.sign(payload, process.env.JWT_SECRET, 
                (err,token) => {
                if(err) throw err;
                res.send({token})
            });
            console.log('jwtsinged')
        } catch (err) {
            console.log(err.message)            
            res.status(501).send('Server Error')
        }

    })

module.exports = router