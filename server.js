const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// register middleware, next exists to tell middleware func when its done
// only when next() is called will it call next functions
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
})

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//   // since next is never called, none of the other functions get called
// });

// so that static files won't be visible after maintenance middlerware
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle:'About page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
  errorMessage: 'unable to handle request'});
});

app.listen(3000, () => {
  console.log("server is up on port 3000");
});
