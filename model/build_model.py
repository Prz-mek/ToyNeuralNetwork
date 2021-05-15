# neural network
from layer import Dense, Tanh
from neuralnetwork import NeuralNetwork
import numpy as np

# Dataset
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

# label to binary matrix
def to_categorical(y, n=10):
    y_new = np.zeros((y.shape[0], n))
    for i in range(y.shape[0]):
        y_new[i, y[i]] = 1
    return y_new

# loading data
X, y = load_digits(return_X_y=True)
X /= 16
y = to_categorical(y)

x_train, x_test, y_train, y_test = train_test_split(X, y, test_size = 0.3)

x_train = x_train.reshape(x_train.shape[0], 8 * 8, 1)
x_test = x_test.reshape(x_test.shape[0], 8 * 8, 1)
y_train = y_train.reshape(y_train.shape[0], 10, 1)
y_test = y_test.reshape(y_test.shape[0], 10, 1)

# neural network build
net = NeuralNetwork([
    Tanh(8 * 8, 16),
    Tanh(16, 16),
    Tanh(16, 10),
])

# train
net.train(x_train, y_train, learning_rate=0.2, epochs = 700)

# best result accuracy: 92%
# l_r = 0.3, e = 300, (64, 16, 16, 10, tanh)

# test
print('Accuracy in test set: ', net.get_accuracy(x_test, y_test))

# saving model
net.save_model('model.json')