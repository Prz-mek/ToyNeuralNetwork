const sigmoid = x => 1 / (1 + Math.exp(-x));

const tanh = x => Math.tanh(x)

const avg = (...args) => {
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        sum += args[i];
    }
    return sum / args.length;
};

const normalize = (...args) => {
    let max = Math.max(...args);
    let min = Math.min(...args);
    let delta = max - min;
    if (max > 0) {
        return args.map(x => (x - min) / delta);
    } else {
        return args;
    }
}

const percentage = (...args) => {
    let sum = 0
    args.forEach(x => {
        if (x > 0) sum += x;
    });
    return args.map(x => Math.max(0, x) / sum);
}

class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        let n = rows * cols;
        this.values = [];
        for (let i = 0; i < n; i++) {
            this.values[i] = 0;
        }
    }

    static fromValues(rows, cols, values) {
        let mat = new Matrix(rows, cols);
        mat.values = values;
        return mat;
    }

    static encodeFromJSON(obj) {
        let mat = new Matrix(obj.rows, obj.cols);
        mat.values = obj.weights;
        return mat;
    }

    map(f) {
        this.values = this.values.map(f);
    }

    add(b) {
        if (b instanceof Matrix) {
            if (this.rows === b.rows && this.cols === b.cols) {
                this.map((e, i) => e + b.values[i]);
            } else {
                console.log('Matrices must have the same dimensions.');
            }
        } else {
            console.log('Argument must be a instance of Matrix.');
        }
    }

    static matmul(a, b) {
        if (a instanceof Matrix && b instanceof Matrix) {
            if (a.cols === b.rows) {
                let r = new Matrix(a.rows, b.cols);
                for (let i = 0; i < a.rows; i++) {
                    for (let j = 0; j < b.cols; j++) {
                        for (let k = 0; k < a.cols; k++) {
                            r.values[i * b.cols + j] += a.values[i * a.cols + k] * b.values[k * b.cols + j];
                        }
                    }
                }
                return r;
            } else {
                console.log('Number of A columns and number of rows must be equal.');
            }
        } else {
            console.log('Arguments must be a instance of Matrix.');
        }
    }
}

class NeuralNetwork {
    constructor(activations, weights, biases) {
        this.activations = activations;
        this.weights = weights;
        this.biases = biases;

        this.layers = [];
        for (let i = 0; i < weights.length; i++) {
            this.layers.push(new Matrix(weights[i].cols, 1));
        }
        this.layers.push(new Matrix(weights[weights.length - 1].rows, 1))
    }

    static encodeFromJSON(obj) {
        let weights = [];
        obj.weights.forEach(element => {
            weights.push(Matrix.encodeFromJSON(element));
        });
        let biases = [];
        obj.biases.forEach(element => {
            biases.push(Matrix.encodeFromJSON(element));
        });
        let activations = [];
        obj.activations.forEach(element => {
            switch(element) {
                case 'tanh':
                    activations.push(tanh);
                    break;
                case 'sigmoid':
                    activations.push(sigmoid);
                    break;
                default:
                    activations.push(tanh);
            }
        });

        return new NeuralNetwork(activations, weights, biases);
    }

    predict(inputs) {
        if (inputs instanceof Matrix) {
            if (inputs.rows === this.layers[0].rows && inputs.cols === this.layers[0].cols) {
                let temp = inputs;
                this.layers[0] = inputs;
                for (let i = 0; i < this.weights.length; i++) {
                    temp = Matrix.matmul(this.weights[i], temp);
                    temp.add(this.biases[i]);
                    temp.map(this.activations[i]);
                    this.layers[i + 1] = temp;
                }

                return temp;
            } else {
                console.log('Input have incorect size.');
            }
        } else {
            console.log('Argument must be a instance of Matrix');
        }
    }
}