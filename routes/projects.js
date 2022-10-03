const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.get('/images/IMG_7975.png', (req, res) => {
    res.render('home')
});

//rendering the work page
router.get('/', async (req, res) => {
    res.render('main/projects');
});

//rendering ViewpointIreland/project page
router.get('/viewpointIreland', async(req, res) => {
    res.render('projects/viewpointIreland')
});

//rendering ShirleysArtStudio/project page
router.get('/shirleys-art-studio', (req, res) => {
    res.render('projects/shirleys-art-studio')
});

router.get('/vacay', (req, res) => {
    res.render('projects/vacay')
});

module.exports = router;