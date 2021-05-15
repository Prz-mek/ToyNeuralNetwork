import numpy as np

def mse(y_true, y_pred):
    return np.mean(np.power(y_true - y_pred, 2))

def mse_derivative(y_true, y_pred):
    return 2 * (y_pred - y_true) / np.size(y_true)


class NeuralNetwork:
    def __init__(self, layers):
        self.layers = layers
    
    def predict(x):
        pass

    def train(self, x_train, y_train, epochs=10, learning_rate=0.01):
        n = x_train.shape[0]
        for e in range(epochs):
            loss = 0
            for x, y in zip(x_train, y_train):
                output = x
                for layer in self.layers:
                    output = layer.forward(output)

                loss += mse(y, output)

                grad = mse_derivative(y, output)
                for layer in reversed(self.layers):
                    grad = layer.backward(grad, learning_rate)

            loss /= n
            print('%d/%d, loss=%f' % (e + 1, epochs, loss))

    def get_accuracy(self, x_test, y_test):
        corrects = 0
        for x, y in zip(x_test, y_test):
            output = x
            for layer in self.layers:
                output = layer.forward(output)
            if np.argmax(output) == np.argmax(y):
                corrects += 1

        return corrects / x_test.shape[0]

    def save_model(self, path):
        weights = str([l.encode_weights() for l in self.layers])
        biaces = str([l.encode_biases() for l in self.layers])
        activations = str([l.encode_activation() for l in self.layers]).replace('\'', '"')
        network = f'{"{"}"weights": {weights}, "biases": {biaces}, "activations": {activations}{"}"}'
        network = network.replace('\'', '')
        with open(path, 'w') as file:
            file.write(network)