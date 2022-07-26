const ExpressError = require('./utils/ExpressError');
const { contactSchema } = require('./schemas')


//CONTACT FORM VALIDATION & ERROR MIDDLEWARE//
module.exports.validateContact = (req, res, next) => {
   
    const {error} = contactSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
       
}