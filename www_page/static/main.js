const canvNet = document.getElementById('graph');
const ctxNet = canvNet.getContext('2d');

const canvDraw = document.getElementById('drawing');
const ctxDraw = canvDraw.getContext('2d');

const canvChart = document.getElementById('chart');
const ctxChart = canvChart.getContext('2d');

const getWidthNeural = () => document.getElementById('neural').offsetWidth;
const getWidthOutput = () => 0.8 * document.getElementById('output').offsetWidth;
const getHeight = () => document.getElementById('neural').offsetHeight;

const sheet = new Sheet(ctxDraw, () => 240, () => 240);
let net;
const chart = new Chart(10, () => getWidthOutput(), () => 300);

// setting canvas size
const setCanvNetDimensions = () => {
    canvDraw.width = 240;
    canvDraw.height = 240;
    canvNet.width = getWidthNeural();
    canvNet.height = getHeight();
    canvChart.width = getWidthOutput();
    canvChart.height = 300;
};

// painting on load and resize
const paint = () => {
    net.countPositions();
    net.paint(ctxNet);
    chart.paint(ctxChart);
};

// geting JSON
const getModel = async () => {
    try {
        const res = await fetch(`${window.location}/model`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
};

const init = async () => {
    const data = await getModel();
    let netModel = NeuralNetwork.encodeFromJSON(data);
    weights = [];
    net = new NetworkView(netModel, getWidthNeural, getHeight, 0.05);
    setCanvNetDimensions();
    paint();
};

init();
window.addEventListener('resize', () => {
    setCanvNetDimensions();
    paint();
});

canvDraw.addEventListener('mousedown', e => sheet.mouseDownPaint(e));
canvDraw.addEventListener('mouseup', () => sheet.mouseUpPaint());
canvDraw.addEventListener('mousemove', e => sheet.draw(e));

document.getElementById('check').onclick = () => sheet.predict(net, ctxNet, ctxChart);
document.getElementById('erase').onclick = () => sheet.clear();