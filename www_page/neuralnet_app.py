from flask import Flask , render_template

app = Flask(__name__)

@app.route('/')
@app.route('/neural')
def home():
    return render_template('index.html')

@app.route('/model/sigmoid8', methods=['GET'])
@app.route('/neural/model/sigmoid8', methods=['GET'])
def send_model_sigmoid8():
    with open('www_page/model_sigmoid8.json', 'r') as file:
        data = file.readline()
        return data

@app.route('/model/tanh8')
@app.route('/neural/model/tanh8', methods=['GET'])
def send_model_tanh8():
    with open('www_page/model_tanh8.json', 'r') as file:
        data = file.readline()
        return data

@app.route('/model/sigmoid28', methods=['GET'])
@app.route('/neural/model/sigmoid28', methods=['GET'])
def send_model_sigmoid28():
    with open('www_page/model_sigmoid28.json', 'r') as file:
        data = file.readline()
        return data

@app.route('/model/tanh28', methods=['GET'])
@app.route('/neural/model/tanh28', methods=['GET'])
def send_model_tanh28():
    with open('www_page/model_tanh28.json', 'r') as file:
        data = file.readline()
        return data

if __name__ == '__main__':
    app.run()