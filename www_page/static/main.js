const canvNet = document.getElementById('graph');
const ctxNet = canvNet.getContext('2d');

const canvDraw = document.getElementById('drawing');
const ctxDraw = canvDraw.getContext('2d');

const canvChart = document.getElementById('chart');
const ctxChart = canvChart.getContext('2d');

const getWidthNeural = () => document.getElementById('neural').offsetWidth;
const getWidthOutput = () => 0.8 * document.getElementById('output').offsetWidth;
const getHeight = () => document.getElementById('neural').offsetHeight;

const sheet = new Sheet(ctxDraw, () => 224, () => 224, 28);
let net;
const chart = new Chart(10, () => getWidthOutput(), () => 300);

// setting canvas size
const setCanvNetDimensions = () => {
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
const getModel = async (model) => {
    try {
        const res = await fetch(`${window.location}/${model}`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
};

const prepareNet = async (model) => {
    const data = await getModel(model);
    let netModel = NeuralNetwork.encodeFromJSON(data);
    net = new NetworkView(netModel, getWidthNeural, getHeight, 0.05);
};

const init = async () => {
    await prepareNet('model/sigmoid');
    canvDraw.width = 224;
    canvDraw.height = 224;
    setCanvNetDimensions();
    paint();
};

init();
window.addEventListener('resize', () => {
    setCanvNetDimensions();
    paint();
});

document.getElementById('netModel1').onclick = async () => prepareNet('model/sigmoid');
document.getElementById('netModel2').onclick = async () => prepareNet('model/tanh');

canvDraw.addEventListener('mousedown', e => sheet.mouseDownPaint(e));
canvDraw.addEventListener('mouseup', () => sheet.mouseUpPaint());
canvDraw.addEventListener('mousemove', e => sheet.draw(e));

document.getElementById('check').onclick = () => sheet.predict(net, ctxNet, ctxChart);
document.getElementById('erase').onclick = () => sheet.clear();