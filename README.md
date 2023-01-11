# MOLA Lab Challenge
This repository contains the code for the MOLA Lab Challenge. The project is divided into three parts.

## Node server
The node server handles the two POST requests namely api/language-detection and api/sentiment-score. The language is detected on the node server itself.

## Flask server (backend folder)
The sentiment endpoint of the node server forwards the tweets to the flask server where sentiment score is calculated and the detected mood is sent back along with the scores. 

## Chrome extensions (extension folder)
The extension folder can be directly loaded into Chrome and then enabled from the twitter website. 

### Thanks!
