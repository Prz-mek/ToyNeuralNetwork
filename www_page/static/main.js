const canvNet = document.getElementById('graph');
const ctx1 = canvNet.getContext('2d');

const canvDraw = document.getElementById('drawing');
const ctx2 = canvDraw.getContext('2d');
canvDraw.width = 240;
canvDraw.height = 240;

const canvChart = document.getElementById('chart');
const ctx3 = canvChart.getContext('2d');

const getWidth = () => document.getElementById('neural').offsetWidth;
const getHeight = () => document.getElementById('neural').offsetHeight;

let net;
let netView;

const setCanvNetDimensions = () => {
    canvNet.width = canvChart.width = getWidth();
    canvNet.height = getHeight();
    canvChart.height = 300;
};

const paint = () => {
    netView.paint(ctx1);
};

window.addEventListener('resize', () => {
    setCanvNetDimensions();
    paint();
});

window.addEventListener('load', () => {

    let drawing = false;

    const draw = (e) => {
        if (!drawing) return;

        let rect = canvDraw.getBoundingClientRect();

        ctx2.lineWidth = 17;
        ctx2.lineCap = 'round';

        ctx2.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvDraw.addEventListener('mousedown', e => { drawing = true; draw(e); });
    canvDraw.addEventListener('mouseup', () => { drawing = false; ctx2.beginPath(); });
    canvDraw.addEventListener('mousemove', draw);
});

document.getElementById('check').onclick = () => {
    let drawing = ctx2.getImageData(0, 0, canvDraw.width, canvDraw.height);

    const data = drawing.data;
    let dataForNet = [];
    for (let i = 3; i < data.length; i += 4) {
        dataForNet.push(data[i]);
    }

    scale = 30;
    sideSmall = 8;
    sideBig = 240;
    dataForNetScaled = [];
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
    let result = net.predict(input);
    netView.update(ctx1);
    let chart = new Chart(10, getWidth, () => 300);
    chart.paint(ctx3, percentage(...result.values));
}

document.getElementById('erase').onclick = () => {
    ctx2.clearRect(0, 0, canvDraw.width, canvDraw.height);
}

// geting neural network data
const getModel = async () => {
    try {
        const res = await fetch(`${window.location}/model`);
        const data = await res.json();
        return data;
    } catch(e) {
        console.log(e);
    }
};

const init = async () => {
    const data = await getModel();
    net = NeuralNetwork.encodeFromJSON(data);
    netView = new NetworkView(net.layers, getWidth, getHeight, 0.05);
    setCanvNetDimensions();
    paint();
};

init();