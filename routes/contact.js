const express = require('express');
const catchAsync = require('../utils/catchAsync');
const sendMail = require('../public/javascripts/mail');
const router = express.Router();
const {contactSchema} = require('../schemas')

//rendering the contact page
router.get('/', (req ,res) => {
    res.render('main/contact')
});

//setting up the contact page contact form request
router.post('/', catchAsync(async(req, res) => {
    const validate = contactSchema.validate(req.body);//validating the form
    console.log(validate);
    const {name, subject, email, text} = req.body; //requesting the data 
    console.log('Data:', req.body);
    sendMail(name, email, subject, text, function(err, data) {//calling on sendMail function to send the data
        if(err) {//making sure to catch any errors
            console.log('ERROR:', err)
            req.flash('error', 'Something went wrong, please try again!')
            res.redirect('/contact')
        }else {
            req.flash('success', 'Message successfully sent!')
            res.redirect('/contact')
            
        }
    });
    
}));

module.exports = router;
    