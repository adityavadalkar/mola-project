from flask import Flask, send_from_directory, request, jsonify
import json
import nltk
nltk.download('vader_lexicon')
from nltk.sentiment import SentimentIntensityAnalyzer
import operator
app = Flask(__name__)

@app.route('/sentiment', methods=['POST'])
def get_data():
  text = request.args.get('text')
  sia = SentimentIntensityAnalyzer()
  score = sia.polarity_scores(text)
  return json.dumps(score)
          

if __name__ == "__main__":
  app.run(debug=True, port=5000)