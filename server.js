const express = require('express');
const bodyParser = require('body-parser');
const langdetect = require('langdetect');
const axios = require('axios')

const app = express();
const PORT = process.env.PORT || 8080
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors())

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.post('/api/language-detection', (req, res) => {
  const tweetText = req.body;
  var result = [];
  var language;
  // console.log(tweetText)
  try{
    tweetText.forEach(tweet => {
      language = langdetect.detect(tweet.tweet_text);
      result.push({ tweet_text: tweet.tweet_text , is_english: language[0].lang === 'en'});
    })
    res.send(result);
  }
  catch(e){
    res.send(e)
  }
});

app.post('/api/sentiment-score', async (req, res) => {
  const tweetText = req.body;
  var mood;
  var analysis;
  var rest = {
    results: []
  };
  try{
     for(const tweet of tweetText){
      await calcScore(rest, tweet)
    };
    res.send(rest)
  }  
  catch{
    res.send({Error: "Calcscore has failed"})
  }
  
});

app.listen(PORT, () => {
  console.log('Server listening on port 8080');
});

async function calcScore(rest, tweet) {
  var score = await axios.post("https://backend-dot-mola-374003.wl.r.appspot.com/sentiment?text="+tweet.tweet_text)
  var max;
  if(score.data['compound']>0){
    max='pos'
  }else if(score.data['compound']<0){
    max='neg'
  }
  else{
    max='neu'
  }
  // console.log(score.data.pos)
  rest.results.push({
    tweet_text: tweet.tweet_text,
    sentiment_score: score.data,
    detected_mood: max,
  })
}