const express = require('express');
const bodyParser = require('body-parser');
const langdetect = require('langdetect');
const Sentiment = require('sentiment');

const app = express();
const PORT = process.env.PORT || 8080
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors())

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

app.post('/api/language-detection', (req, res) => {
  const tweetText = req.body;
  var result = [];
  var language;
  console.log(tweetText)
  try{
    tweetText.forEach(tweet => {
      language = langdetect.detect(tweet.tweet_text);
      result.push({ tweet_text: tweet.tweet_text , is_english: language[0].lang === 'en'});
    })
  }
  catch{
    res.send({Error: "Tweets are empty"})
  }
  res.send(result);
});

app.post('/api/sentiment-score', (req, res) => {
  const tweetText = req.body;
  var sentiment = new Sentiment();
  var mood;
  var analysis;
  var results = [];
  try{
    tweetText.forEach(tweet => {
      analysis = sentiment.analyze(tweet.tweet_text);
      console.log(analysis)
      if(analysis.score>0){
        mood = "POSITIVE"
      }else if(analysis.score<0){
        mood = "NEGATIVE"
      }else {
        mood = "NEUTRAL"
      }  
      results.push({
        tweet_text: tweet.tweet_text,
        sentiment_score: analysis.score,
        detected_mood: mood,
      })
    });
  }  
  catch{
    res.send({Error: "Tweets are empty"})
  }
  
  res.send(results);
});

app.listen(PORT, () => {
  console.log('Server listening on port 8080');
});
