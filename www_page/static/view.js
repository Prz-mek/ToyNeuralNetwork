class NetworkView {
    constructor(activations, width, height, margin) {
        this.activations = activations;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.positions = this.countPositions();
    }

    countPositions() {
        let marginX = this.margin * this.width();
        let marginY = this.margin * this.height();
        let width = this.width() - 2 * marginX;
        let height = this.height() - 2 * marginY;
        let layersCount = this.activations.map(x => x.rows);
        let gapX = width / (layersCount.length - 1);
        let gapY = height / Math.max(...layersCount);
        let positions = [];
        for (let i = 0; i < layersCount.length; i++) {
            let x = marginX + i * gapX;
            positions.push([x])
            for (let j = 0; j < layersCount[i]; j++) {
                let y = marginY + height / 2 - (layersCount[i] - 1) / 2 * gapY + j * gapY;
                positions[i].push(y);
            }
        }
        return positions;
    }

    paint(ctx) {
        this.positions = this.countPositions()
        for (let i = 1; i < this.positions.length; i++) {
            let x1 = this.positions[i - 1][0]
            let x2 = this.positions[i][0];
            for (let j = 1; j < this.positions[i].length; j++) {
                let y2 = this.positions[i][j];
                for (let k = 1; k < this.positions[i - 1].length; k++) {
                    let y1 = this.positions[i - 1][k];
                    ctx.strokeStyle = 'white';
                    ctx.beginPath();
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x1, y1);
                    ctx.stroke();
                }
            }
        }

        let r = 10;
        for (let i = 0; i < this.positions.length; i++) {
            let x = this.positions[i][0];
            let layerActivationNormalized = normalize(...this.activations[i].values);
            for (let j = 1; j < this.positions[i].length; j++) {
                let y = this.positions[i][j];
                paintPerceptron(ctx, x, y, r, layerActivationNormalized[j - 1]);
            }
        }
    }

    update(ctx) {
        let r = 10;
        for (let i = 0; i < this.positions.length; i++) {
            let x = this.positions[i][0];
            let layerActivationNormalized = normalize(...this.activations[i].values);
            for (let j = 1; j < this.positions[i].length; j++) {
                let y = this.positions[i][j];
                paintPerceptron(ctx, x, y, r, layerActivationNormalized[j - 1]);
            }
        }
    }
}

const paintPerceptron = (ctx, x, y, r, activation, m = 2) => {
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

class Chart {
    constructor(classesNum, width, height) {
        this.classesNum = classesNum;
        this.width = width;
        this.height = height;
    }

    paint(ctx, data) {
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
            ctx.fillRect(gap + i * (colWidth + gap), this.height(), colWidth, -this.height() * data[i]);
            ctx.fillStyle = 'white';
            ctx.font = `${gap}px serif`;
            ctx.fillText(`${i}`, 1.7 * gap + i * (colWidth + gap), this.height(), gap)
        }
    }
}