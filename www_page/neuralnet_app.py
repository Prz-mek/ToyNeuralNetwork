from flask import Flask , render_template

app = Flask(__name__)

@app.route('/')
@app.route('/neural')
def home():
    return render_template('index.html')

@app.route('/model/sigmoid')
@app.route('/neural/model/sigmoid', methods=['GET'])
def send_model_sigmoid():
    with open('www_page/model_sigmoid.json', 'r') as file:
        data = file.readline()
        return data

@app.route('/model/tanh')
@app.route('/neural/model/tanh', methods=['GET'])
def send_model_tanh():
    with open('www_page/model_tanh.json', 'r') as file:
        data = file.readline()
        return data

if __name__ == '__main__':
    app.run()