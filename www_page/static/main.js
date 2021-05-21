const canvNet = document.getElementById('graph');
const ctxNet = canvNet.getContext('2d');

const canvDraw = document.getElementById('drawing');
const ctxDraw = canvDraw.getContext('2d');
canvDraw.width = 240;
canvDraw.height = 240;

const canvChart = document.getElementById('chart');
const ctxChart = canvChart.getContext('2d');

const getWidthNeural = () => document.getElementById('neural').offsetWidth;
const getWidthOutput = () => 0.8 * document.getElementById('output').offsetWidth;
const getHeight = () => document.getElementById('neural').offsetHeight;

let net;
let netView;
const chart = new Chart(10, () => getWidthOutput(), () => 300);
const input  = new Input(ctxDraw, () => 240, () => 240);

// setting canvas size
const setCanvNetDimensions = () => {
    canvNet.width = getWidthNeural();
    canvNet.height = getHeight();
    canvChart.width = getWidthOutput();
    canvChart.height = 300;
};

// painting on load and resize
const paint = () => {
    netView.countPositions();
    netView.paint(ctxNet);
    chart.paint(ctxChart);
};

// geting JSON
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
    weights = [];
    net.weights.forEach(element => {
        weights.push(element.normalize());
    });
    netView = new NetworkView(net.layers, weights, getWidthNeural, getHeight, 0.05);
    setCanvNetDimensions();
    paint();
};

init();
window.addEventListener('resize', () => {
    setCanvNetDimensions();
    paint();
});

canvDraw.addEventListener('mousedown', e => input.mouseDownPaint(e));
canvDraw.addEventListener('mouseup', () => input.mouseUpPaint());
canvDraw.addEventListener('mousemove', e => input.draw(e));

document.getElementById('check').onclick = () => input.predict(netView, ctxNet, ctxChart);
document.getElementById('erase').onclick = () => input.clear();