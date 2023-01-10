( () => {
    const sendToLanguageDetectionAPI = (tweetTexts, callback) => {
        const endpoint = 'https://mola-374003.wl.r.appspot.com/api/language-detection';
        // console.log(tweetTexts)
        fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(tweetTexts)
        }).then(response => response.json()).then(callback).catch(error => console.log(error));
    }
    
    const handleLanguageDetectionResponse = (response) => {
    // Filter English tweets
        console.log("response ",response)
        const englishTweets = response.filter(r => r.is_english);
        const ind = [];
        response.forEach((res, i) => {
            if(res.is_english){
                ind.push(i)
            }
        })
        // Send English tweets to the sentiment score API endpoint
        sendToSentimentScoreAPI(englishTweets, handleSentimentScoreResponse, ind);
    }
    
    const sendToSentimentScoreAPI = (tweetTexts, callback, indices) => {
        const endpoint = 'https://mola-374003.wl.r.appspot.com/api/sentiment-score';
        fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(tweetTexts)
        }).then(response => response.json()).then(response => callback(response, indices)).catch(error => console.log(error));
    }
    
    const handleSentimentScoreResponse = (response, indices) => {
    // TODO: Add emojis next to the dates of the tweets
        var elems = document.querySelectorAll('[data-testid="User-Names"]')
        var mood;
        const sep = `<div dir="ltr" aria-hidden="true" class="css-901oao r-1bwzh9t r-1q142lx r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-s1qlax r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">·</span></div>`
        // console.log("Response length ", response.results.length)
        // console.log("indices", indices)
        indices.forEach(ind => {
            // console.log(`Hello ${ind} ${JSON.stringify(response.results[ind])}`)
            switch(response.results[ind].detected_mood) {
                case "pos":
                    mood = `😊`
                    break;
                case "neg":
                    mood = `☹️`
                    break;
                case "neu":
                    mood = `😐`
                    break;
                default:
            }
            elems[ind].innerHTML += sep + `<div class="css-4rbku5 css-18t94o4 css-901oao r-1bwzh9t r-1loqt21 r-xoduu5 r-1q142lx r-1w6e6rj r-37j5jr r-a023e6 r-16dba41 r-9aw3ui r-rjixqe r-bcqeeo r-3s2u2q r-qvutc0">Detected Mood: ${mood}</div>`
        })
    }
    var elems = document.querySelectorAll('[data-testid="tweetText"]')
    var tweets = [];
    elems.forEach(elem => {
        let children = elem.children
        // console.log(elem.children)
        text = ""
        for(child of children){
            if(child.nodeName=='IMG'){
                text += child.alt
            }
            else if(child.nodeName=='SPAN'){
                text += child.innerText
            }
        }
        // let spans = elem.getElementsByTagName("span");
        // tweets.push({tweet_text :spans[0].innerText})
        // console.log(text)
        tweets.push({tweet_text: text})
    })
    // console.log(tweets)

    sendToLanguageDetectionAPI(tweets, handleLanguageDetectionResponse);
})()