from flask import Flask , render_template, request, jsonify
import json

app = Flask(__name__)

@app.route('/')
@app.route('/neural')
def home():
    return render_template('index.html')

@app.route('/model')
@app.route('/neural/model', methods=['GET'])
def send_model():
    with open('www_page/model.json', 'r') as file:
        data = file.readline()
        return data

if __name__ == '__main__':
    app.run()