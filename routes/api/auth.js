const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator')

const User = require('../../models/User');
// @route   GET api/route
// @desc    Test route
// @access  Public
router.get('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error');
    }
})

// @route   POST api/route
// @desc    Authenticate user and get token
// @access  Public
router.post('/', [
    check('email', 'Please include a valud email').isEmail(),
    check('password', 'Password is required').exists()
] ,
    async (req,res) => {
        const errors= validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        
        const {email, password} = req.body

        try {
            let user = await User.findOne({email})
            // See if user exists
            if(!user){
                res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
            }
            
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})

            const payload = {
                user: {
                    id: user.id
                }
            }
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

module.exports = router;