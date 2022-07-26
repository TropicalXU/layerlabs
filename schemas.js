const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

//setting up the joi middleware
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

//CONTACT FORM VALIDATION//
module.exports.contactSchema = Joi.object({
    contact: Joi.object({
        name: Joi.string().required().escapeHTML(),
        email: Joi.string().required().escapeHTML(),
        subject: Joi.string().required().escapeHTML(),
        text: Joi.string().required().escapeHTML()



    }).required(),

});  