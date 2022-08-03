if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//REQUIRING OUR PACKAGES --
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const home = require('./routes/home');
const projects = require('./routes/projects');
const discover = require('./routes/discover');
const contact = require('./routes/contact');
const legal = require('./routes/legal');
//creating the mongo store
const MongoDBStore = require("connect-mongo");


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/LayerLabs';
// const dbUrl = process.env.DB_URL;

//CONNECTING TO DATABASE
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();
// APP CONFIGURATION
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//APP MIDDLEWARE
//TO PARSE THE REQUEST BODY
app.use(express.static(__dirname + '/public'));//TO SERVE STATIC FILES SUCH AS IMAGES/CSS/JS FILES - BUILT IB MIDDLEWARE FUNC
app.use(express.urlencoded({
    extended: false
}));

app.use(mongoSanitize({
    replaceWith: '_'
}));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const secret = process.env.SECRET;

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60//IF NO DATA HAS CHANGED DONT UPDATE FOR 24HOURS
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

//APP SESSIONS 
const sessionConfig = {
    store,
    name: 'session',//name used as cookie id so that it is not easy to identify if someone was to look for the session id-more secure
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secureProxy: true,
          //httpOnly - used to protect cookire from client-side use
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    
}

app.use(session(sessionConfig));
app.use(express.json());
app.use(flash());

//setting up security using helmet
app.use(helmet());

app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.referrerPolicy());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://ajax.googleapis.com",
    "http://fonts.googleapis.com",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com",
    "https://cdnjs.cloudflare.com",
];
const connectSrcUrls = [
    "https://cdnjs.cloudflare.com"
];
const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://cdnjs.cloudflare.com"
  
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'","'unsafe-eval'",...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'","https://cdnjs.cloudflare.com", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhrs5mwhz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
               
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
//CREATING FLASH MIDDLEWARE TO USE IN ROUTER TO ACCESS ANYWHERE
//on every single request what ever is in the flash
//under success we will have access to in our locals 
//under the key success
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/home', home);
app.use('/discover', discover);
app.use('/projects', projects);
app.use('/contact', contact);
app.use('/legal', legal);

// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.get('/', (req, res) => {
    res.render('main/home')

})

app.get('/about', (req, res) => {
    res.render('main/about')
    
})

app.get('/about/bio', (req, res) => {
    res.render('main/aboutMe')
})

//setting up our port
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})