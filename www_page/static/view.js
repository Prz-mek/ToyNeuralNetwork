const paintPerceptron = (ctx, x, y, r, activation, m = 1) => {
    if (m !== 0) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    const color = activation * 255;
    ctx.beginPath();
    ctx.arc(x, y, r - m, 0, Math.PI * 2, true);
    ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
    ctx.fill();
};

const paintEdge = (ctx, x1, y1, x2, y2, activation) => {
    let color = 255 * activation;
    ctx.strokeStyle = `rgb(${color}, ${color}, ${color})`;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.stroke();
};

class Sheet {

    constructor(ctx, width, height) {
        this.drawing = false;
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    draw(e) {
        if (!this.drawing) return;

        let rect = canvDraw.getBoundingClientRect();

        this.ctx.lineWidth = 17;
        this.ctx.lineCap = 'round';

        this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    mouseDownPaint(e) {
        this.drawing = true;
        this.draw(e);
    }

    mouseUpPaint() {
        this.drawing = false;
        this.ctx.beginPath();
    }

    predict(net, ctxNet, ctxChart) {
        let drawing = this.ctx.getImageData(0, 0, canvDraw.width, canvDraw.height);

        const data = drawing.data;
        let dataForNet = [];
        for (let i = 3; i < data.length; i += 4) {
            dataForNet.push(data[i]);
        }

        let scale = 30;
        let sideSmall = 8;
        let sideBig = 240;
        let dataForNetScaled = [];
        for (let i = 0; i < sideSmall; i++) {
            for (let j = 0; j < sideSmall; j++) {
                let values = [];
                for (let k = 0; k < scale; k++) {
                    for (let l = 0; l < scale; l++) {
                        values.push(dataForNet[(i * scale + k) * sideBig + j * scale + l]);
                    }
                }

                dataForNetScaled.push(avg(...values));
            }
        }

        let input = Matrix.fromValues(64, 1, normalize(...dataForNetScaled));
        let result = net.predict(ctxNet, input);
        chart.setPlot(percentage(...result.values))
        chart.paint(ctxChart);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width(), this.height());
    }
}

class NetworkView {
    constructor(model, width, height, margin) {
        this.model = model;
        this.activations = model.layers;
        this.weights = model.weights;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.countPositions();
    }

    countPositions() {
        let margin = this.margin * Math.min(this.width(), this.height());
        let width = this.width() - 2 * margin;
        let height = this.height() - 2 * margin;
        let layersCount = this.activations.map(x => x.rows);
        let gapX = width / (layersCount.length - 1);
        let gapY = height / Math.max(...layersCount);
        this.r = Math.min(gapX, gapY, margin) / 2.5;
        let positions = [];
        for (let i = 0; i < layersCount.length; i++) {
            let x = margin + i * gapX;
            positions.push([x])
            for (let j = 0; j < layersCount[i]; j++) {
                let y = margin + height / 2 - (layersCount[i] - 1) / 2 * gapY + j * gapY;
                positions[i].push(y);
            }
        }
        this.positions = positions;
    }

    predict(ctx, input) {
        let output = this.model.predict(input);
        this.paint(ctx);
        return output;
    }

    paint(ctx) {
        ctx.clearRect(0, 0, this.width(), this.height());
        for (let i = 1; i < this.positions.length; i++) {
            let activatedWeights = Matrix.multiplyByVector(this.model.weights[i - 1], this.activations[i - 1], 1);
            activatedWeights.map(sigmoid);
            activatedWeights = activatedWeights.normalize();
            let x1 = this.positions[i - 1][0]
            let x2 = this.positions[i][0];
            for (let j = 1; j < this.positions[i].length; j++) {
                let y2 = this.positions[i][j];
                for (let k = 1; k < this.positions[i - 1].length; k++) {
                    let y1 = this.positions[i - 1][k];
                    let activation = activatedWeights.get(j - 1, k - 1);
                    if (0.4 < activation || activation < 0.7) {
                        paintEdge(ctx, x1, y1, x2, y2, activation);
                    }
                }
            }

            for (let j = 1; j < this.positions[i].length; j++) {
                let y2 = this.positions[i][j];
                for (let k = 1; k < this.positions[i - 1].length; k++) {
                    let y1 = this.positions[i - 1][k];
                    let activation = activatedWeights.get(j - 1, k - 1);
                    if (activation <= 0.4 || 0.7 <= activation) {
                        paintEdge(ctx, x1, y1, x2, y2, activation);
                    }
                }
            }
        }

        for (let i = 0; i < this.positions.length; i++) {
            let x = this.positions[i][0];
            let layerActivationNormalized = normalize(...this.model.layers[i].values);
            for (let j = 1; j < this.positions[i].length; j++) {
                let y = this.positions[i][j];
                paintPerceptron(ctx, x, y, this.r, layerActivationNormalized[j - 1]);
            }
        }
    }
}

class Chart {
    constructor(classesNum, width, height) {
        this.classesNum = classesNum;
        this.width = width;
        this.height = height;
        this.plot = new Array(classesNum).fill(0);
    }

    setPlot(plot) {
        this.plot = plot;
    }

    paint(ctx) {
        let colWidth = 2 * this.width() / (3 * this.classesNum + 1);
        let gap = colWidth / 2;
        ctx.clearRect(0, 0, this.width(), this.height());
        for (let k = 0; k <= 1; k += 0.2) {
            let y = k * this.height();
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width(), y);
            ctx.stroke();
        }

        for (let i = 0; i < this.classesNum; i++) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(gap + i * (colWidth + gap), this.height(), colWidth, -this.height() * this.plot[i]);
            ctx.fillStyle = 'white';
            ctx.font = `${gap}px serif`;
            ctx.fillText(`${i}`, 1.7 * gap + i * (colWidth + gap), this.height(), gap)
        }
    }
}