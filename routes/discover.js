const express = require('express');
const router = express.Router();

//rendering the discover page
router.get('/', (req ,res) => {
    res.render('main/discover')
})

//rendering the personal page
router.get('/personal', (req, res) => {
    res.render('packages/personal')
})

//rendering the business page
router.get('/business', (req, res) => {
    res.render('packages/business')
})

module.exports = router;