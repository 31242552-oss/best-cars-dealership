"""Sentiment Analyzer Microservice using Flask and NLTK VADER."""

import os
from flask import Flask, jsonify
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Ensure vader lexicon is present
try:
    nltk.data.find("sentiment/vader_lexicon.zip")
except LookupError:
    nltk.download("vader_lexicon")

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()


@app.route("/", methods=["GET"])
def home():
    """Root endpoint for health check."""
    return jsonify({
        "status": "online",
        "service": "Best Cars Sentiment Analyzer"
    })


@app.route("/analyze/<path:text>", methods=["GET"])
def analyze_sentiment(text):
    """Analyze the sentiment of a given text string.

    Returns positive, negative, or neutral.
    """
    scores = analyzer.polarity_scores(text)
    compound = scores.get("compound", 0.0)

    if compound >= 0.05:
        sentiment = "positive"
    elif compound <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return jsonify({
        "status": 200,
        "sentiment": sentiment,
        "scores": scores
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
