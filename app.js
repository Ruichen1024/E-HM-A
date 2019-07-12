var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apikey = require('./config/apikeys');

session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')



const MONGODB_URI = 'mongodb://heroku_w2s8q0hf:b7un87d0pgs7159nsvhcmstnb9@ds245927.mlab.com:45927/heroku_w2s8q0hf';


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/myDB', { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});





var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HelloMongoose';

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });


const profileController = require('./controllers/profileController')
const statsController = require('./controllers/statsController')
const forumPostController = require('./controllers/forumPostController')
const recipeController = require('./controllers/recipeController')


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/


app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["huangruichen0226@gmail.com"];
const monitorList = ["liu.hantao@outlook.com", "richbryant1024@gmail.com"];
// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="EMCare"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    if (req.user.googleemail.endsWith("@brandeis.edu") ||
          approvedLogins.includes(req.user.googleemail))
          {
            console.log("user has been Authenticated")
            res.locals.user = req.user
            res.locals.loggedIn = true
          }
    else {
      res.locals.loggedIn = false
    }
    console.log('req.user = ')
    console.dir(req.user)
    // here is where we can handle whitelisted logins ...
    if (req.user){
      if (req.user.googleemail=='rhuang@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'Owner'
      } else if (monitorList.includes(req.user.googleemail)){
        console.log("A monitor has logged in")
        res.locals.status = 'Monitor'
      }else {
        console.log('User has logged in')
        res.locals.status = 'Common user'
      }
    }
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile')
});

app.get('/editProfile', isLoggedIn, function(req, res){
  res.render('editProfile')
});

app.post('/updateProfile', profileController.updateProfile)




// we require them to be logged in to see their profile
app.get('/stats', function(req, res) {
        res.render('stats')/*, {
            user : req.user // get the user out of session and pass to template
        });*/
    });
// END OF THE AUTHENTICATION ROUTES


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/intro', function(req, res, next) {
  res.render('intro',{title:"EMCare Intro"});
});

app.get('/quiz1', function(req, res, next) {
  res.render('quiz1',{title:"Quiz1"});
});

app.get('/care', function(req, res, next) {
  res.render('care',{title:"EMCare Care"});
});

app.get('/myform', function(req, res, next) {
  res.render('myform',{title:"EMCare form"});
});

app.post('/form2', function(req, res, next) {
  res.render('form2data',{title:"Form2 Data", stat:req.body.Stats});
});


function processFormData(req,res,next){
  res.render('formdata',
     {title:"Form Data",name:req.body.name, age:req.body.age, bp:req.body.bp, pulse:req.body.pulse})
}


app.post('/processform', statsController.saveStats)

app.get('/Added', function(req, res, next) {
  res.render('Added',{title:"ADD"});
});



app.post('/showStats', statsController.getAllStats)

app.get('/showStats/:id', statsController.getOneStat)

app.get('/forum',forumPostController.getAllForumPosts)

app.post('/forumDelete',forumPostController.deleteForumPost)

app.get('/recipes',recipeController.getAllRecipes)

app.post('/processRecipe', recipeController.saveRecipes)

app.get('/recipeAdded', recipeController.getAllRecipes)

app.post('/recipeDelete',recipeController.deleteRecipe)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
