export interface Lesson {
  id: number;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Capstone";
  duration: string;
  description: string;
  concepts: string[];
  tools: string[];
  starterCode: string;
  steps: { title: string; code: string; explanation: string }[];
  quiz: { question: string; options: string[]; answer: number; explanation: string }[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "VADER and NLTK Introduction",
    difficulty: "Beginner",
    duration: "45 min",
    description: "Understand rule-based sentiment analysis using VADER (Valence Aware Dictionary and sEntiment Reasoner) and NLTK. Learn how lexicon-based approaches compute compound sentiment scores.",
    concepts: ["Lexicon-based sentiment analysis", "Compound score interpretation", "Sentence tokenization", "Polarity scores"],
    tools: ["VADER", "NLTK", "Python"],
    starterCode: `# Lesson 1: VADER Sentiment Analysis
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Download VADER lexicon
nltk.download('vader_lexicon')

# Initialize analyzer
sia = SentimentIntensityAnalyzer()

# Analyze a sentence
text = "The movie was absolutely fantastic! I loved every minute."
scores = sia.polarity_scores(text)

print(f"Text: {text}")
print(f"Positive: {scores['pos']:.3f}")
print(f"Negative: {scores['neg']:.3f}")
print(f"Neutral:  {scores['neu']:.3f}")
print(f"Compound: {scores['compound']:.3f}")

# Interpret
if scores['compound'] >= 0.05:
    print("\\n→ Sentiment: POSITIVE")
elif scores['compound'] <= -0.05:
    print("\\n→ Sentiment: NEGATIVE")
else:
    print("\\n→ Sentiment: NEUTRAL")
`,
    steps: [
      { title: "Install and import VADER", code: `import nltk\nfrom nltk.sentiment.vader import SentimentIntensityAnalyzer\nnltk.download('vader_lexicon')\nsia = SentimentIntensityAnalyzer()`, explanation: "VADER is built into NLTK. The lexicon must be downloaded once." },
      { title: "Compute polarity scores", code: `scores = sia.polarity_scores("The food was amazing!")\nprint(scores)`, explanation: "Returns a dict with pos, neg, neu, and compound scores." },
      { title: "Interpret the compound score", code: `compound = scores['compound']\nlabel = 'POSITIVE' if compound >= 0.05 else 'NEGATIVE' if compound <= -0.05 else 'NEUTRAL'\nprint(f"Sentiment: {label}")`, explanation: "The compound score ranges from -1 (most negative) to +1 (most positive)." },
    ],
    quiz: [
      { question: "What does the VADER compound score range represent?", options: ["-1.0 to +1.0", "0 to 1.0", "-100 to +100", "0 to 100"], answer: 0, explanation: "VADER compound scores are normalized to range from -1.0 (extremely negative) to +1.0 (extremely positive)." },
      { question: "Which threshold marks a sentence as POSITIVE using VADER?", options: ["compound >= 0.1", "compound >= 0.05", "compound > 0", "pos > 0.5"], answer: 1, explanation: "VADER's recommended threshold is compound >= 0.05 for positive classification." },
      { question: "What type of approach is VADER?", options: ["Machine learning", "Deep learning", "Rule-based / lexicon-based", "Statistical"], answer: 2, explanation: "VADER is a rule-based, lexicon-based approach that uses a dictionary of sentiment-rated words." },
      { question: "What does VADER stand for?", options: ["Value-Added Dictionary Evaluator", "Valence Aware Dictionary and sEntiment Reasoner", "Vectorized Affective Dataset Extractor", "Variable Analysis Driver for Emotion Recognition"], answer: 1, explanation: "VADER = Valence Aware Dictionary and sEntiment Reasoner, created by Hutto & Gilbert (2014)." },
      { question: "Which VADER score component represents the fraction of words rated as negative?", options: ["compound", "neu", "neg", "val"], answer: 2, explanation: "The 'neg' score represents the proportion of text that falls in the negative category." },
    ],
  },
  {
    id: 2,
    title: "Text Preprocessing and TF-IDF Feature Extraction",
    difficulty: "Beginner",
    duration: "60 min",
    description: "Learn to clean raw text through a 6-step preprocessing pipeline and convert it into numerical feature vectors using TF-IDF.",
    concepts: ["Tokenization", "Stop word removal", "Lemmatization", "TF-IDF weighting", "Feature matrices"],
    tools: ["NLTK", "scikit-learn", "TfidfVectorizer"],
    starterCode: `import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')

def preprocess(text):
    # Step 1: Lowercase
    text = text.lower()
    # Step 2: Remove HTML and special chars
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'[^a-z\\s]', '', text)
    # Step 3: Tokenize
    tokens = nltk.word_tokenize(text)
    # Step 4: Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [t for t in tokens if t not in stop_words]
    # Step 5: Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    return ' '.join(tokens)

documents = [
    "The movie was great and very entertaining!",
    "I hated the film, it was so boring and slow.",
    "Absolutely brilliant performances from all actors.",
]

cleaned = [preprocess(doc) for doc in documents]
for orig, clean in zip(documents, cleaned):
    print(f"Original: {orig}")
    print(f"Cleaned:  {clean}\\n")

# TF-IDF
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(cleaned)
df = pd.DataFrame(tfidf_matrix.toarray(), columns=vectorizer.get_feature_names_out())
print("\\nTF-IDF Matrix:")
print(df.round(3))
`,
    steps: [
      { title: "Lowercase and clean", code: `text = text.lower()\ntext = re.sub(r'[^a-z\\s]', '', text)`, explanation: "Normalizing case and removing non-alphabetic characters reduces vocabulary size." },
      { title: "Tokenize", code: `tokens = nltk.word_tokenize(text)`, explanation: "Splits text into individual word tokens." },
      { title: "Remove stop words", code: `stop_words = set(stopwords.words('english'))\ntokens = [t for t in tokens if t not in stop_words]`, explanation: "Words like 'the', 'is', 'at' carry little semantic meaning." },
      { title: "Lemmatize", code: `lemmatizer = WordNetLemmatizer()\ntokens = [lemmatizer.lemmatize(t) for t in tokens]`, explanation: "Reduces words to their base form: 'running' → 'run', 'loved' → 'love'." },
      { title: "Apply TF-IDF", code: `from sklearn.feature_extraction.text import TfidfVectorizer\nvec = TfidfVectorizer()\nX = vec.fit_transform(cleaned)`, explanation: "TF-IDF weights words by importance: common words get lower weights." },
    ],
    quiz: [
      { question: "What does TF in TF-IDF stand for?", options: ["Text Frequency", "Term Frequency", "Token Factor", "Total Features"], answer: 1, explanation: "TF = Term Frequency: how often a word appears in a document." },
      { question: "Why do we remove stop words?", options: ["They are misspelled", "They occur very rarely", "They carry little semantic meaning", "They cause errors"], answer: 2, explanation: "Stop words like 'the', 'and', 'is' are so common they provide little discriminative value for classification." },
      { question: "What does lemmatization do?", options: ["Removes punctuation", "Converts words to root form", "Counts word frequency", "Splits sentences"], answer: 1, explanation: "Lemmatization converts words to their dictionary base form using morphological analysis." },
      { question: "High IDF score for a word means:", options: ["It appears in many documents", "It appears in few documents", "It is a stop word", "It is misspelled"], answer: 1, explanation: "IDF = Inverse Document Frequency. High IDF = word appears in few documents = more distinctive/informative." },
      { question: "Which sklearn class computes TF-IDF?", options: ["CountVectorizer", "TfidfVectorizer", "HashingVectorizer", "PipelineVectorizer"], answer: 1, explanation: "TfidfVectorizer combines CountVectorizer and TfidfTransformer into one efficient step." },
    ],
  },
  {
    id: 3,
    title: "Neural Network Sentiment Analysis with MLP on IMDb",
    difficulty: "Intermediate",
    duration: "90 min",
    description: "Build a Multi-layer Perceptron (MLP) neural network to classify movie review sentiment from the IMDb dataset using scikit-learn.",
    concepts: ["Neural network architecture", "Hidden layers", "Activation functions", "Backpropagation", "Hyperparameter tuning"],
    tools: ["scikit-learn", "MLPClassifier", "IMDb dataset (adapted)", "TfidfVectorizer"],
    starterCode: `# Lesson 3: Neural Network Sentiment Analysis
from sklearn.neural_network import MLPClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pandas as pd

# Mock dataset (IMDb-like movie reviews)
data = {
    'review': [
        "The movie was great and very entertaining!",
        "I hated the film, it was so boring and slow.",
        "Absolutely brilliant performances from all actors.",
        "A waste of time, terrible directing.",
        "Loved the story and the cinematography.",
        "The worst movie I have ever seen in my life.",
        "Simply amazing, a masterpiece of modern cinema.",
        "I regret watching this, completely uninspiring.",
        "Highly recommended, one of the best this year.",
        "Boring, repetitive, and lacked any depth."
    ] * 5,  # Multiply to have more training data
    'sentiment': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0] * 5
}

df = pd.DataFrame(data)

# Vectorize text using TF-IDF
vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
X = vectorizer.fit_transform(df['review'])
y = df['sentiment']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build and train MLP Neural Network
# hidden_layer_sizes=(10, 5) means 2 hidden layers with 10 and 5 neurons
mlp = MLPClassifier(hidden_layer_sizes=(10, 5), activation='relu', 
                    solver='adam', max_iter=200, random_state=42)

print("Training Neural Network...")
mlp.fit(X_train, y_train)

# Predictions
y_pred = mlp.predict(X_test)

# Results
print("\\nModel Evaluation:")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print("\\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Negative', 'Positive']))

# Real-time testing
test_sentences = ["A truly wonderful experience", "That was absolute garbage"]
X_new = vectorizer.transform(test_sentences)
preds = mlp.predict(X_new)

print("\\nTest Predictions:")
for sent, p in zip(test_sentences, preds):
    label = "POSITIVE" if p == 1 else "NEGATIVE"
    print(f"  {label}: {sent}")
`,
    steps: [
      { title: "Define Neural Network Layers", code: `mlp = MLPClassifier(hidden_layer_sizes=(10, 5))`, explanation: "Adjust the complexity by defining hidden layers and neuron counts." },
      { title: "Select Activation Function", code: `MLPClassifier(activation='relu')`, explanation: "ReLu remains the most common activation function for hidden layers." },
      { title: "Train and Backpropagate", code: `mlp.fit(X_train, y_train)`, explanation: "The model iteratively updates weights using backpropagation to minimize error." },
      { title: "Evaluate Model Performance", code: `print(classification_report(y_test, y_pred))`, explanation: "Look at Precision, Recall, and F1-score to judge model health." },
    ],
    quiz: [
      { question: "What does MLP stand for in neural networks?", options: ["Multi-layer Perceptron", "Minimum Loss Path", "Matrix Linear Processing", "Manual Linear Parameter"], answer: 0, explanation: "MLP = Multi-layer Perceptron, a fundamental class of feedforward artificial neural networks." },
      { question: "What occurs during the 'backpropagation' phase?", options: ["Data is loaded", "Error is calculated and weights are updated", "Predictions are printed", "Features are vectorized"], answer: 1, explanation: "Backpropagation is the algorithm used to update weights based on the error of the current prediction." },
      { question: "In hidden_layer_sizes=(10, 5), how many neurons are in the second hidden layer?", options: ["10", "15", "5", "2"], answer: 2, explanation: "The second number in the tuple represents the neuron count for the second hidden layer." },
      { question: "Why vectorize text before feeding it to an MLP?", options: ["To make it shorter", "Neural networks only understand numerical data", "To remove stop words", "To save memory"], answer: 1, explanation: "Mathematical models like neural networks require all inputs to be numerical vectors." },
      { question: "Which algorithm is commonly used as a 'solver' for MLP optimization?", options: ["Stochastic Gradient Descent (sgd)", "Adam", "Both Adam and sgd", "Newton's Method"], answer: 2, explanation: "Both 'adam' (stochastic gradient-based optimizer) and 'sgd' (stochastic gradient descent) are common solvers." },
    ],
  },
  {
    id: 4,
    title: "Ensemble Methods: Boosting Accuracy with Random Forest",
    difficulty: "Intermediate",
    duration: "75 min",
    description: "Learn how to combine multiple decision trees into a powerful ensemble model called a Random Forest to achieve state-of-the-art accuracy in sentiment classification.",
    concepts: ["Bagging", "Decision trees", "Random Forest", "Feature importance", "Ensemble learning"],
    tools: ["scikit-learn", "RandomForestClassifier", "TfidfVectorizer"],
    starterCode: `# Lesson 4: Random Forest Ensemble
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd

# Dataset (Expanded movie reviews)
data = {
    'review': [
        "A cinematic masterpiece, worth every penny.", "Tragic waste of talent and time.",
        "Beautifully shot, but the plot was thin.", "The best action movie of the decade!",
        "Lacked emotion and felt very mechanical.", "I will definitely watch this again.",
        "Too long and extremely predictable.", "The acting was surprisingly good.",
        "Don't bother, it's a complete mess.", "A fresh take on a classic story."
    ] * 10,
    'sentiment': [1, 0, 1, 1, 0, 1, 0, 1, 0, 1] * 10
}

df = pd.DataFrame(data)

# Vectorize
vectorizer = TfidfVectorizer(max_features=500, stop_words='english')
X = vectorizer.fit_transform(df['review'])
y = df['sentiment']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build Random Forest
# n_estimators=100 means we use 100 individual decision trees
rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)

print("Training Random Forest...")
rf.fit(X_train, y_train)

# Accuracy
y_pred = rf.predict(X_test)
print(f"\\nEnsemble Accuracy: {accuracy_score(y_test, y_pred):.2f}")

# Feature Importance
print("\\nTop Predictive Terms (Feature Importance):")
import numpy as np
importances = rf.feature_importances_
indices = np.argsort(importances)[-5:][::-1]
feature_names = vectorizer.get_feature_names_out()
for i in indices:
    print(f"  {feature_names[i]}: {importances[i]:.4f}")

# Test
test = ["What a brilliant and fresh movie!", "predictable and messy"]
X_new = vectorizer.transform(test)
for t, p in zip(test, rf.predict(X_new)):
    print(f"\\nResult: {'POSITIVE' if p==1 else 'NEGATIVE'} -> {t}")
`,
    steps: [
      { title: "Understand Random Forest", code: `rf = RandomForestClassifier(n_estimators=100)`, explanation: "Random Forest builds many independent decision trees and averages their results." },
      { title: "Measure Feature Importance", code: `print(rf.feature_importances_)`, explanation: "Random Forests can tell us which words were most important for the classification." },
      { title: "Tune Tree Depth", code: `RandomForestClassifier(max_depth=10)`, explanation: "Limiting depth prevents individual trees from overfitting to specific noise." },
    ],
    quiz: [
      { question: "What is an 'ensemble' in machine learning?", options: ["A single model", "A combination of multiple models", "A large dataset", "A tuning technique"], answer: 1, explanation: "Ensemble learning combines multiple models to improve generalization and accuracy." },
      { question: "What technique does Random Forest use?", options: ["Boosting", "Bagging", "Clustering", "Dropout"], answer: 1, explanation: "Random Forest uses Bagging (Bootstrap Aggregating) to build multiple trees on subsets of data." },
      { question: "A high 'feature importance' score means:", options: ["The word is very common", "The word is a stop word", "The word is strongly predictive of a class", "The word is misspelled"], answer: 2, explanation: "Feature importance values indicate how much a feature contributed to the model's decisions." },
      { question: "What does n_estimators represent?", options: ["Number of samples", "Number of decision trees", "Number of layers", "Learning rate"], answer: 1, explanation: "n_estimators is the number of trees in the forest ensemble." },
      { question: "Why is Random Forest less likely to overfit than a single decision tree?", options: ["It uses more data", "It averages out the errors of individual trees", "It is faster", "It uses deep learning"], answer: 1, explanation: "By averaging many diverse trees, Random Forest reduces variance and prevents overfitting." },
    ],
  },
  {
    id: 5,
    title: "Twitter Sentiment: Data Cleaning and Regex Patterns",
    difficulty: "Beginner",
    duration: "45 min",
    description: "Learn to handle the 'messy' data of social media. Use Regular Expressions (Regex) to clean tweets by removing handles, hashtags, and URLs before analysis.",
    concepts: ["Regular Expressions", "Data cleaning", "Social media noise", "Feature engineering", "Text normalization"],
    tools: ["re (Python Regex)", "NLTK", "Pandas"],
    starterCode: `# Lesson 5: Cleaning Social Media Data
import re
import pandas as pd
from nltk.tokenize import word_tokenize

# Messy raw tweets
raw_tweets = [
    "I LOVE the new #iPhone! Best purchase ever. http://apple.com/iphone",
    "The customer service at @TelecomCorp is absolute garbage. 😡 #angry",
    "Just watched a great movie. @Netflix did it again! 🎬",
    "Worst experience ever... so slow and buggy. http://bit.ly/fix-it",
    "Feeling neutral about the update. It's okay, I guess. @MobileApp #Update"
]

def clean_tweet(text):
    # 1. Remove URLs
    text = re.sub(r'http\\S+', '', text)
    # 2. Remove Twitter handles (@user)
    text = re.sub(r'@\\w+', '', text)
    # 3. Remove Hashtags (but keep the word)
    text = re.sub(r'#', '', text)
    # 4. Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\\s]', '', text)
    # 5. Lowercase and strip whitespace
    return text.lower().strip()

print("=== Raw vs Cleaned Tweets ===")
cleaned_data = []
for tweet in raw_tweets:
    clean = clean_tweet(tweet)
    cleaned_data.append(clean)
    print(f"RAW:   {tweet}")
    print(f"CLEAN: {clean}\\n")

# Tokenization check
print("=== Processed Tokens ===")
for text in cleaned_data:
    tokens = word_tokenize(text)
    print(tokens)
`,
    steps: [
      { title: "Define URL Regex", code: `re.sub(r'http\\S+', '', text)`, explanation: "Matches 'http' followed by any non-whitespace characters to strip links." },
      { title: "Strip User Mentions", code: `re.sub(r'@\\w+', '', text)`, explanation: "Removes @mentions which usually don't carry sentiment value for the subject." },
      { title: "Handle Hashtags", code: `re.sub(r'#', '', text)`, explanation: "Removing the # symbol keeps the keyword (e.g., #happy becomes happy) for analysis." },
      { title: "Filter Non-Alpha", code: `re.sub(r'[^a-zA-Z\\s]', '', text)`, explanation: "Stripping emojis, numbers, and symbols leaves only clean text for the vectorizer." },
    ],
    quiz: [
      { question: "What does \\S+ match in a regular expression?", options: ["Spaces only", "One or more non-whitespace characters", "Digits only", "Newline characters"], answer: 1, explanation: "\\S matches any non-whitespace character, and + means one or more." },
      { question: "Why remove URLs before sentiment analysis?", options: ["They are too long", "They don't typically carry sentiment and add noise", "Models can't read them", "To save memory"], answer: 1, explanation: "URLs are unique strings that add noise to the vocabulary without contributing to the sentiment score." },
      { question: "What does the @\\w+ pattern target?", options: ["Email addresses", "Twitter handles", "Website links", "Hashtags"], answer: 1, explanation: "@ followed by word characters (\\w) is the standard pattern for social media handles." },
      { question: "Regex [^a-z] matches:", options: ["Any lowercase letter", "Anything that is NOT a lowercase letter", "Only numbers", "Only spaces"], answer: 1, explanation: "The ^ inside brackets [ ] acts as a negation operator." },
      { question: "Which cleaning step is most important for social media?", options: ["Uppercasing", "Removing noise (URLs, handles, emojis)", "Removing all spaces", "Adding more hashtags"], answer: 1, explanation: "Social media is exceptionally noisy; Removing non-textual elements is critical for model accuracy." },
    ],
  },
  {
    id: 6,
    title: "Flask REST API Deployment with JSON Endpoints",
    difficulty: "Advanced",
    duration: "90 min",
    description: "Package a sentiment analysis model into a production-ready Flask REST API with JSON endpoints, error handling, and rate limiting.",
    concepts: ["REST API design", "JSON serialization", "Error handling", "Rate limiting", "Docker deployment"],
    tools: ["Flask", "Flask-CORS", "Gunicorn", "Docker"],
    starterCode: `from flask import Flask, request, jsonify
from functools import wraps
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import time
import logging

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
logging.basicConfig(level=logging.INFO)

# Initialize analyzer
sia = SentimentIntensityAnalyzer()

# Simple in-memory rate limiter
request_counts = {}
RATE_LIMIT = 100  # requests per minute

def rate_limit(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        client_ip = request.remote_addr
        now = time.time()
        if client_ip not in request_counts:
            request_counts[client_ip] = []
        # Clean old requests (> 60 seconds)
        request_counts[client_ip] = [t for t in request_counts[client_ip] if now - t < 60]
        if len(request_counts[client_ip]) >= RATE_LIMIT:
            return jsonify({"error": "Rate limit exceeded", "retry_after": 60}), 429
        request_counts[client_ip].append(now)
        return f(*args, **kwargs)
    return wrapper

@app.route('/api/v1/analyze', methods=['POST'])
@rate_limit
def analyze():
    """Analyze sentiment of text. POST JSON: {"text": "your text"}"""
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Request body must include 'text' field"}), 400
    
    text = data['text']
    if not isinstance(text, str) or len(text) < 1:
        return jsonify({"error": "Text must be a non-empty string"}), 422
    
    scores = sia.polarity_scores(text)
    compound = scores['compound']
    label = 'POSITIVE' if compound >= 0.05 else 'NEGATIVE' if compound <= -0.05 else 'NEUTRAL'
    
    return jsonify({
        "text": text[:200],
        "sentiment": label,
        "scores": {"positive": round(scores['pos'], 4), "negative": round(scores['neg'], 4),
                   "neutral": round(scores['neu'], 4), "compound": round(compound, 4)},
        "model": "VADER",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    })

@app.route('/api/v1/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "version": "1.0.0"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
`,
    steps: [
      { title: "Create Flask app", code: `from flask import Flask, request, jsonify\napp = Flask(__name__)\n\n@app.route('/api/v1/analyze', methods=['POST'])\ndef analyze():\n    data = request.get_json()\n    return jsonify({"result": "ok"})`, explanation: "Flask's jsonify automatically sets Content-Type: application/json headers." },
      { title: "Add input validation", code: `if not data or 'text' not in data:\n    return jsonify({"error": "Missing 'text' field"}), 400`, explanation: "Always validate API inputs and return appropriate HTTP status codes (400 = Bad Request)." },
      { title: "Run model inference", code: `scores = sia.polarity_scores(data['text'])\ncompound = scores['compound']\nlabel = 'POSITIVE' if compound >= 0.05 else 'NEGATIVE'`, explanation: "Load the model once at startup rather than per request for performance." },
      { title: "Add CORS headers", code: `from flask_cors import CORS\nCORS(app, origins=['http://localhost:3000'])`, explanation: "Cross-Origin Resource Sharing must be enabled for browser clients to call the API." },
      { title: "Deploy with Gunicorn", code: `gunicorn -w 4 -b 0.0.0.0:5000 app:app`, explanation: "Flask's dev server is single-threaded. Gunicorn provides multi-worker production serving." },
    ],
    quiz: [
      { question: "What HTTP status code means 'Bad Request'?", options: ["200", "404", "400", "500"], answer: 2, explanation: "400 = Bad Request: The server cannot process the request due to client error (e.g., malformed JSON)." },
      { question: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Client-Origin Request System", "Cross-Object Rendering Service", "Central Origin Response Schema"], answer: 0, explanation: "CORS = Cross-Origin Resource Sharing, a browser security feature that restricts cross-origin HTTP requests." },
      { question: "Why use Gunicorn instead of Flask's built-in server?", options: ["It has better JSON support", "It provides multi-worker production-grade HTTP serving", "It auto-generates API docs", "It handles HTTPS automatically"], answer: 1, explanation: "Flask's dev server is single-threaded and not meant for production. Gunicorn enables concurrent request handling." },
      { question: "REST API status code for 'Too Many Requests'?", options: ["429", "503", "401", "422"], answer: 0, explanation: "429 = Too Many Requests: Used for rate limiting to inform clients to slow down." },
      { question: "Which HTTP method is most appropriate for sending text to analyze?", options: ["GET", "PUT", "POST", "PATCH"], answer: 2, explanation: "POST is used to send data to the server for processing. GET is for retrieval and shouldn't contain a body." },
    ],
  },
  {
    id: 7,
    title: "Advanced NLTK: POS Tagging and NER for Sentiment Hints",
    difficulty: "Advanced",
    duration: "75 min",
    description: "Use NLTK's powerful tagging and chunking tools to identify Part-of-Speech tags and Named Entities, providing deeper linguistic context for sentiment analysis.",
    concepts: ["Named Entity Recognition", "POS tagging", "Noun phrase chunking", "Syntactic structure", "Grammatical filtering"],
    tools: ["NLTK", "pos_tag", "ne_chunk", "treebank"],
    starterCode: `# Lesson 7: Advanced NLTK Analysis
import nltk

# Ensure resources are downloaded
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')
nltk.download('punkt')

text = """Apple Inc. announced excellent earnings in California yesterday. 
The CEO was very happy with the results, though some analysts remain skeptical."""

# 1. Tokenize
tokens = nltk.word_tokenize(text)

# 2. Part-of-Speech Tagging
# Identifies nouns, verbs, adjectives, etc.
pos_tags = nltk.pos_tag(tokens)

print("=== Part-of-Speech Tags (Top 10) ===")
for word, tag in pos_tags[:10]:
    print(f"  {word:15} -> {tag}")

# 3. Filtering for Sentiment-bearing words (Adjectives)
adjectives = [word for word, tag in pos_tags if tag.startswith('JJ')]
print(f"\\nAdjectives found: {adjectives}")

# 4. Named Entity Recognition
# Identifies Organizations, Persons, Locations
chunks = nltk.ne_chunk(pos_tags)

print("\\n=== Named Entities ===")
for chunk in chunks:
    if hasattr(chunk, 'label'):
        print(f"  [{chunk.label()}] {' '.join(c[0] for c in chunk)}")

# 5. Extract Entities of specific types
locations = []
for chunk in chunks:
    if hasattr(chunk, 'label') and chunk.label() == 'GPE': # Geo-Political Entity
        locations.append(' '.join(c[0] for c in chunk))
print(f"\\nLocations identified: {locations}")
`,
    steps: [
      { title: "Apply POS Tagging", code: `tokens = nltk.word_tokenize(text)\ntags = nltk.pos_tag(tokens)`, explanation: "POS tagging labels each word with its grammatical category (Verb, Noun, Adjective)." },
      { title: "Identify Named Entities", code: `chunks = nltk.ne_chunk(tags)`, explanation: "NER identifies real-world objects like 'Apple Inc.' or 'California'." },
      { title: "Filter by Adjectives", code: `adjs = [w for w, t in tags if t.startswith('JJ')]`, explanation: "Isolating adjectives (JJ tags) is a great way to focus on sentiment-carrying words." },
      { title: "Handle Geo-Political Entities", code: `if chunk.label() == 'GPE'`, explanation: "GPE represents Geo-Political Entities like cities, states, and countries." },
    ],
    quiz: [
      { question: "What does POS tagging stand for?", options: ["Position of Subject", "Part-of-Speech tagging", "Point of Sentiment", "Parsing of Sentences"], answer: 1, explanation: "POS tagging identifies the grammatical category of each word in a text." },
      { question: "Which NLTK tag usually represents an Adjective?", options: ["NN", "VB", "JJ", "RB"], answer: 2, explanation: "In the Penn Treebank tagset, JJ is the standard tag for adjectives." },
      { question: "What is an 'entity' in NER?", options: ["Any word", "A real-world object like person, place, or org", "A sentiment score", "A stop word"], answer: 1, explanation: "Entities are specific real-world objects identified within the text." },
      { question: "What tag represents a Geo-Political Entity (GPE)?", options: ["PERSON", "ORGANIZATION", "GPE", "DATE"], answer: 2, explanation: "GPE stands for Geo-Political Entity, such as 'California' or 'London'." },
      { question: "Why use POS tags for preprocessing?", options: ["It's faster", "To filter out words that don't carry sentiment like conjunctions", "To count total words", "To fix spelling"], answer: 1, explanation: "By filtering for adjectives and verbs, we can remove noise and focus the model on sentiment-rich words." },
    ],
  },
  {
    id: 8,
    title: "Visualization and Reporting with Matplotlib and Seaborn",
    difficulty: "Advanced",
    duration: "60 min",
    description: "Create publication-quality visualizations for sentiment analysis results: distribution plots, confusion matrices, and top-word frequency charts.",
    concepts: ["Sentiment distribution", "Confusion matrix", "Frequency analysis", "Seaborn aesthetics", "Subplots layout"],
    tools: ["Matplotlib", "Seaborn", "Pandas"],
    starterCode: `# Lesson 8: Visualization and Reporting
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from collections import Counter

# Mock sentiment analysis results
np.random.seed(42)
n = 500
is_positive = np.random.choice([True, False], size=n, p=[0.6, 0.4])
scores = np.where(is_positive, np.random.beta(7, 2, n), -np.random.beta(7, 2, n))
labels = ['POSITIVE' if s > 0.05 else 'NEGATIVE' if s < -0.05 else 'NEUTRAL' for s in scores]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Sentiment Analysis Report', fontsize=16, fontweight='bold', y=1.02)

# 1. Distribution of compound scores
axes[0, 0].hist(scores, bins=40, color='#1D9E75', edgecolor='white', alpha=0.85)
axes[0, 0].set_title('Compound Score Distribution')
axes[0, 0].set_xlabel('Compound Score')

# 2. Sentiment label breakdown (pie chart)
counts = Counter(labels)
colors = ['#1D9E75', '#E24B4A', '#EF9F27']
axes[0, 1].pie(counts.values(), labels=counts.keys(), autopct='%1.1f%%',
               colors=colors, startangle=90)
axes[0, 1].set_title('Sentiment Distribution')

# 3. Top Words Bar Chart
words = ["great", "amazing", "bad", "terrible", "ok", "good", "waste", "love"]
freqs = [45, 38, 30, 25, 20, 18, 15, 12]
axes[1, 0].barh(words, freqs, color='#219ebc')
axes[1, 0].set_title('Top Sentiment Words Frequency')
axes[1, 0].invert_yaxis()

# 4. Time-series sentiment trend
dates = np.arange(30)
trend = np.convolve(scores[:30], np.ones(5)/5, mode='same')
axes[1, 1].plot(dates, trend, color='#0F5E4E', linewidth=2)
axes[1, 1].set_title('30-Day Sentiment Trend')

plt.tight_layout()
print("✅ Visualization Report Generated")
`,
    steps: [
      { title: "Set up figure layout", code: `fig, axes = plt.subplots(2, 2)`, explanation: "Use subplots to organize multiple data views in one image." },
      { title: "Plot score distribution", code: `axes[0,0].hist(scores)`, explanation: "A histogram shows how biased the sentiment is towards positive or negative values." },
      { title: "Bar Chart for Frequencies", code: `axes[1,0].barh(words, freqs)`, explanation: "Horizontal bar charts are clear for displaying frequent tokens/entities." },
    ],
    quiz: [
      { question: "What does tight_layout() do?", options: ["Saves the image", "Adjusts padding to prevent label overlap", "Changes colors", "Normalizes data"], answer: 1, explanation: "tight_layout() is essential for ensuring labels and titles don't overlap in subplots." },
      { question: "In a pie chart, the 'autopct' parameter:", options: ["Autosaves the file", "Displays percentages inside the slices", "Selects colors", "Sorts the data"], answer: 1, explanation: "autopct enables displaying the numerical percentage of each category automatically." },
      { question: "A bimodal distribution in scores suggests:", options: ["Poor model", "Clear separation between sentiment classes", "Overfitting", "Missing data"], answer: 1, explanation: "Two distinct peaks usually mean the model is confident in separating positive from negative samples." },
      { question: "Which coordinate accesses the bottom-right subplot in a 2x2 grid?", options: ["axes[0,0]", "axes[1,0]", "axes[1,1]", "axes[0,1]"], answer: 2, explanation: "Grid indexing is 0-based: [row, col]. Bottom-right is [1, 1]." },
      { question: "Why use inverted y-axis for horizontal bar charts?", options: ["It looks cooler", "To show most frequent items at the top", "Requirement of Seaborn", "It saves space"], answer: 1, explanation: "Inverting the axis ensures the list reads from top (most frequent) to bottom." },
    ],
  },
  {
    id: 9,
    title: "Capstone — End-to-End Pipeline: Scraping to Dashboard",
    difficulty: "Capstone",
    duration: "4 hours",
    description: "Build a complete production system: process reviews, classify with an ensemble model, store in SQLite, and visualize results on a dashboard.",
    concepts: ["System architecture", "Data pipeline", "Database storage", "Ensemble classification", "Dashboard reporting"],
    tools: ["NLTK", "scikit-learn", "SQLite", "Matplotlib", "Pandas"],
    starterCode: `"""
Capstone: End-to-End Sentiment Analysis Pipeline
================================================
Architecture:
  NLTK (tag) → sklearn (ensemble classify) → SQLite (store)
  → Matplotlib (visualize dashboard)
"""
import sqlite3
import pandas as pd
from datetime import datetime
import re
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer

# 1. Database Setup
def init_db():
    conn = sqlite3.connect('sentiment_lab.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS results (id TEXT PRIMARY KEY, text TEXT, label TEXT, score REAL)''')
    conn.commit()
    return conn

# 2. Pipeline Components
def process_and_classify(text, vectorizer, model):
    cleaned = re.sub(r'[^a-zA-Z\\s]', '', text.lower())
    X = vectorizer.transform([cleaned])
    pred = model.predict(X)[0]
    label = 'POSITIVE' if pred == 1 else 'NEGATIVE'
    return label

# 3. Simulate Data & Run Pipeline
print("🔄 Initializing Capstone Pipeline...")
conn = init_db()

# Mock training for the ensemble model
train_texts = ["Great movie", "Hated it", "Fantastic", "Waste of time"]
train_labels = [1, 0, 1, 0]
vec = TfidfVectorizer().fit(train_texts)
model = RandomForestClassifier(n_estimators=10).fit(vec.transform(train_texts), train_labels)

REVIEWS = [
    {"id": "001", "text": "Absolutely incredible experience! Highly recommend."},
    {"id": "002", "text": "The worst garbage I have ever paid for."},
    {"id": "003", "text": "Decent story, but the pacing was terrible."}
]

for r in REVIEWS:
    label = process_and_classify(r['text'], vec, model)
    conn.execute("INSERT OR REPLACE INTO results VALUES (?,?,?,?)", (r['id'], r['text'], label, 0.0))
    print(f"  Processed {r['id']}: {label}")

conn.commit()
print("\\n✅ Pipeline complete. Data saved to sentiment_lab.db")
`,
    steps: [
      { title: "Initialize SQLite Storage", code: `conn = sqlite3.connect('sentiment_lab.db')`, explanation: "Use a local database file to persist analysis results." },
      { title: "Apply Ensemble Classifier", code: `model.predict(X)`, explanation: "The Random Forest ensemble provides robust predictions across diverse texts." },
      { title: "Generate Final Report", code: `plt.savefig('dashboard.png')`, explanation: "Save your analysis as a visual asset for the business dashboard." },
    ],
    quiz: [
      { question: "What is an end-to-end pipeline?", options: ["Scraping only", "The model only", "Data collection → processing → storage → visualization", "Deployment only"], answer: 2, explanation: "End-to-end means the entire chain of data operations is handled by the system." },
      { question: "Why use SQLite for the Capstone?", options: ["It's heavy", "It's a portable, serverless database for local data", "It requires internet", "It only handles text"], answer: 1, explanation: "SQLite is perfect for local applications as it stores everything in a single .db file." },
      { question: "Which tool handles the 'Serving' part of the pipeline?", options: ["NLTK", "Flask/Dashboard", "Tokenizer", "SQLite"], answer: 1, explanation: "Serving involves making the results accessible via APIs or Dashboards." },
    ],
  },
];

export const getLessonById = (id: number) => lessons.find((l) => l.id === id);
