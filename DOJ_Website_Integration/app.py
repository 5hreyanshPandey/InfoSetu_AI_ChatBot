import pandas as pd
import random
import re
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the CSV file
def load_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        df.columns = [col.lower().strip() for col in df.columns]
        required_columns = ['article number', 'description']
        for col in required_columns:
            if col not in df.columns:
                raise ValueError(f"Required column '{col}' is missing.")
        df['article number'] = df['article number'].astype(str).str.upper().str.strip()
        duplicates = df[df.duplicated('article number', keep=False)]
        if not duplicates.empty:
            articles_dict = df.groupby('article number')['description'].apply(list).to_dict()
        else:
            articles_dict = dict(zip(df['article number'], df['description']))
        return articles_dict
    except Exception as e:
        return str(e)

def greeting_response(text):
    text = text.lower()
    bot_greetings = ['Howdy!', 'Hey there!', 'Hello!', 'Hi!', 'Wassup!']
    user_greetings = ['hi', 'hello', 'hey', 'wass up', 'howdy']
    for word in text.split():
        if word in user_greetings:
            return random.choice(bot_greetings)
    return None

def extract_article_number(text):
    pattern = re.compile(r'\b(?:what is|tell me about|explain)\s+article\s+(\d+[A-Z]?)\b', re.IGNORECASE)
    match = pattern.search(text)
    if match:
        return match.group(1).upper().strip()
    return None

def bot_response(user_input, articles_dict):
    user_input = user_input.lower()
    article_num = extract_article_number(user_input)
    if article_num:
        if article_num in articles_dict:
            descriptions = articles_dict[article_num]
            response = f"**Article {article_num}:**"
            if isinstance(descriptions, list):
                for idx, desc in enumerate(descriptions, 1):
                    response += f"\n{idx}. {desc}"
            else:
                response += f" {descriptions}"
            return response
        return "I'm sorry, I couldn't find that article. Please check the article number and try again."
    return "I'm sorry, I didn't understand that. Please ask about a specific article (e.g., 'What is Article 2A?')."

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_input = data.get('user_input')
    response = bot_response(user_input, articles_dict)
    
    # Replace newlines with <br> for HTML formatting
    formatted_response = response.replace('\n', ' ')
    
    return jsonify({"response": formatted_response})



if __name__ == "__main__":
    # Load the articles dictionary
    csv_file_path = 'COI.csv'  # Update path as necessary
    articles_dict = load_csv(csv_file_path)
    app.run(host='0.0.0.0', port=5000)
