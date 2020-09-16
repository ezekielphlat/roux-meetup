const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');
const { response } = require('express');
const { resolve } = require('path');

const app = express();

const port = 3000;
app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['sdfaeG343dsfdsfsd', '33fsdfsdFbbsdfefdffd'],
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.locals.siteName = 'ROUX Meetups';
app.use(express.static(path.join(__dirname, './static')));

// set locals for request object. this variable will be available for all requests
app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    console.log(response.locals);
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use('/', routes({ feedbackService, speakersService }));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
