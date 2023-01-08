const express = require('express');
const bodyParser = require('body-parser');
const langdetect = require('langdetect');
const Sentiment = require('sentiment');

const app = express();
const PORT = process.env.PORT || 8080
app.use(bodyParser.json());

app.post('/api/language-detection', (req, res) => {
  const tweetText = req.body.tweet_text;
  const language = langdetect.detect(tweetText);
  console.log(language)
  res.send({ tweet_text: tweetText , is_english: language[0].lang === 'en'});
});

app.post('/api/sentiment-score', (req, res) => {
  const tweetText = req.body.tweet_text;
  var sentiment = new Sentiment();
  const analysis = sentiment.analyze(tweetText);
  console.log(analysis)
  var mood;
  if(analysis.score>0){
    mood = "POSITIVE"
  }else if(analysis.score<0){
    mood = "NEGATIVE"
  }else {
    mood = "NEUTRAL"
  }
  res.send({
    tweet_text: tweetText,
    sentiment_score: analysis.score,
    detected_mood: mood,
  });
});

app.listen(PORT, () => {
  console.log('Server listening on port 8000');
});
