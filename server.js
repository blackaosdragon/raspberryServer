const Ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');

const page = express();

const wsPort = 5001;
const pagePort = 5000;


const wss = new Ws.Server({port: wsPort});

page.use('/',express.static(__dirname+'/home'))

page.listen(pagePort, data => {
    console.log(data);
    console.log(`Servidor corriendo en el puerto ${pagePort}`);
});

const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const parser = port.pipe(new Readline({delimiter: '\r\n'}));

wss.on('connection', ws => {
    parser.on('data', temp => {
        ws.send(temp);
    })
    console.log('Cliente conectado');
})




