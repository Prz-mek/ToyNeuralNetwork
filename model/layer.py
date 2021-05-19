import numpy as np

# Dense layer
class Dense:
    def __init__(self, input_size, output_size, activation, activation_derivative):
        self.weights = np.random.randn(output_size, input_size)
        self.bias = np.random.randn(output_size, 1)
        self.activation = activation
        self.activation_derivative = activation_derivative

    def forward(self, input):
        self.input = input
        self.z = np.dot(self.weights, self.input) + self.bias
        return self.activation(self.z)


    def backward(self, output_gradient, learning_rate):
        activation_gradient = np.multiply(output_gradient, self.activation_derivative(self.z))
        weights_gradient = np.dot(activation_gradient, self.input.T)
        self.weights -= learning_rate * weights_gradient
        self.bias -= learning_rate * activation_gradient
        return np.dot(self.weights.T, activation_gradient)

    def encode_weights(self):
        w = self.weights.reshape((self.weights.size,)).tolist()
        return f'{"{"}"rows": {self.weights.shape[0]}, "cols": {self.weights.shape[1]}, "weights": {w}{"}"}'

    def encode_biases(self):
        b = self.bias.reshape((self.bias.size)).tolist()
        return f'{"{"}"rows": {self.bias.shape[0]}, "cols": {1}, "weights": {b}{"}"}'

    def encode_activation(self):
        pass

# Activation fuction: hyperbolic tangent, extends Dense
class Tanh(Dense):
    def __init__(self, input_size, output_size):
        tanh = lambda x: np.tanh(x)
        tanh_derivative = lambda x: 1 - np.tanh(x) ** 2
        super().__init__(input_size, output_size, tanh,tanh_derivative)
    
    def encode_activation(self):
        return "tanh"