import pandas as pd
from fuzzywuzzy import fuzz
from flask import Flask, jsonify, request, render_template
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# load the database
df = pd.read_csv('ideas.csv')
df1 = pd.read_csv('ideas_database.csv')

# define the machine learning algorithm
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['text'])
y = df['label']
clf = LogisticRegression()
clf.fit(X, y)

# define the Flask app
app = Flask(__name__)

# define the endpoint for the machine learning algorithm
@app.route('/check-idea', methods=['POST'])
def check_idea():
    # get the input data from the website
    idea_title = request.json['title']
    idea_description = request.json['description']
    
    # preprocess the input data
    X_test = vectorizer.transform([idea_description])
    
    # use the machine learning algorithm to predict the label
    label = clf.predict(X_test)[0]
    
    # check if the idea is unique
    is_unique = True
    for _, row in df1.iterrows():
        description_similarity = fuzz.token_set_ratio(idea_description.lower(), row['text'].lower())
        title_similarity = fuzz.token_set_ratio(idea_title.lower(), row['label'].lower())
        if (description_similarity > 70) or (title_similarity > 70):
            is_unique = False
            break
    
    # if the idea is unique, add it to the database
    if is_unique:
        df1.loc[len(df1.index)] = [idea_description, idea_title]
        df1.to_csv('ideas_database.csv', index=False)
    
    # return the result back to the website
    return jsonify({'label': label, 'is_unique': is_unique})

# define the homepage
@app.route('/')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
