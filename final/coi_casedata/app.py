# app.py
from flask import Flask, render_template, request, jsonify
import pandas as pd
import random
import re
import os
import sys

app = Flask(__name__)

# Step 1: Load the CSV files
def load_csv(file_path, key_column):
    try:
        df = pd.read_csv(file_path)
        df.columns = [col.lower().strip() for col in df.columns]
        required_columns = [key_column]

        for col in required_columns:
            if col not in df.columns:
                print(f"Error: Required column '{col}' is missing in the CSV file.")
                sys.exit()

        df[key_column] = df[key_column].astype(str).str.upper().str.strip()

        # Check for duplicate keys
        duplicates = df[df.duplicated(key_column, keep=False)]
        if not duplicates.empty:
            # Group descriptions into list per key
            data_dict = df.groupby(key_column).apply(lambda x: x.to_dict(orient='records')).to_dict()
        else:
            # Create a dictionary mapping keys to single records
            data_dict = df.set_index(key_column).T.to_dict()

        return data_dict
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        sys.exit()
    except pd.errors.EmptyDataError:
        print(f"Error: The file '{file_path}' is empty.")
        sys.exit()
    except pd.errors.ParserError:
        print(f"Error: The file '{file_path}' does not appear to be in CSV format.")
        sys.exit()
    except Exception as e:
        print(f"An unexpected error occurred while loading the CSV: {e}")
        sys.exit()

# Load both CSV files
script_dir = os.path.dirname(os.path.abspath(__file__))
coi_csv_path = os.path.join(script_dir, 'COI.csv')
judiciary_csv_path = os.path.join(script_dir, 'judiciary_mock_data.csv')

articles_dict = load_csv(coi_csv_path, 'article number')
cases_dict = load_csv(judiciary_csv_path, 'filing_number')

# Step 2: Greeting response
def greeting_response(text):
    text = text.lower()
    bot_greetings = ['Howdy!', 'Hey there!', 'Hello!', 'Hi!', 'Wassup!']
    user_greetings = ['hi', 'hello', 'hey', 'wass up', 'howdy']
    for word in text.split():
        if word in user_greetings:
            return random.choice(bot_greetings)
    return None

# Step 3: Extract article number using regex
def extract_article_number(text):
    pattern = re.compile(r'\b(?:what is|tell me about|explain)\s+article\s+(\d+[A-Z]?)\b', re.IGNORECASE)
    match = pattern.search(text)
    if match:
        return match.group(1).upper().strip()
    return None

# Step 3.1: Extract filing number using regex
def extract_filing_number(text):
    pattern = re.compile(r'\b(?:details of case)\s+(\d+)\b', re.IGNORECASE)
    match = pattern.search(text)
    if match:
        return match.group(1).upper().strip()
    return None

# Step 4: Bot response function
def bot_response(user_input):
    user_input = user_input.lower()

    # Check for exit or bye commands
    if user_input in ["exit", "bye", "quit", "goodbye"]:
        return "Goodbye! Have a great day!"

    # Check for greeting
    greeting = greeting_response(user_input)
    if greeting:
        return greeting

    # Check if the user is asking for a specific article
    article_num = extract_article_number(user_input)
    if article_num:
        if article_num in articles_dict:
            descriptions = articles_dict[article_num]
            if isinstance(descriptions, list):
                response = f"**Article {article_num}:**"
                for idx, desc in enumerate(descriptions, 1):
                    response += f"\n{idx}. {desc['description']}"
                return response
            else:
                return f"**Article {article_num}:** {descriptions['description']}"
        else:
            return "I'm sorry, I couldn't find that article. Please check the article number and try again."

    # Check if the user is asking for a specific case
    filing_num = extract_filing_number(user_input)
    if filing_num:
        if filing_num in cases_dict:
            case_details = cases_dict[filing_num]
            if isinstance(case_details, list):
                response = f"**Case Details for Filing Number {filing_num}:**"
                for case in case_details:
                    for key, value in case.items():
                        if key != 'filing_number':
                            response += f"\n**{key.capitalize().replace('_', ' ')}:** {value}"
                return response
            else:
                response = f"**Case Details for Filing Number {filing_num}:**\n"
                for key, value in case_details.items():
                    if key != 'filing_number':
                        response += f"**{key.capitalize().replace('_', ' ')}:** {value}\n"
                return response
        else:
            return "I'm sorry, I couldn't find that case. Please check the filing number and try again."

    # If not recognized
    return "I'm sorry, I didn't understand that. Please ask about a specific article (e.g., 'What is Article 2A?') or case (e.g., 'Details of case 12345')."

# Main page route
@app.route('/')
def home():
    return render_template('index.html')

# Endpoint for getting chatbot response
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'response': "Please enter a query."})

    response_message = bot_response(user_message)
    return jsonify({'response': response_message})

if __name__ == "__main__":
    app.run(debug=True)
