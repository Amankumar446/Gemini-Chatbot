from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Update your environment variable key here
my_api_key_gemini = os.getenv('AIzaSyDdRmlT6_aUrJoxMYhjJ6vr013yKcsAtUY')  # Make sure to set this environment variable
genai.configure(api_key=my_api_key_gemini)

# Initialize the model
model = genai.GenerativeModel('gemini-pro')

@app.route('/ask', methods=['POST','GET'])
def ask():
    try:
        prompt = request.json.get('prompt')
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        response = model.generate_content(prompt)

        if response.text:
            return jsonify({"data": response.text}), 200
        else:
            return jsonify({"data": "Sorry, but I think Gemini didn't want to answer that!"}), 200
    except Exception as e:
        print(f"Error: {e}")  # Add detailed logging
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)