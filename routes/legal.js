const express = require('express');
const router = express.Router();

//rendering the privacy policy page
router.get('/privacyPolicy', (req,res) => {
    res.render('legal/privacyPolicy')
});

//rendering the terms and conditions page
router.get('/termsAndConditions', (req, res) => {
    res.render('legal/termsAndConditions')
});

module.exports = router;