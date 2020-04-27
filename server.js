const Ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');

const page = express();

const wsPort = 5001;
const pagePort = 5000;
let sTempOficina = "";
let fTempOficina = 0.0;
let sTemperatura;


const wss = new Ws.Server({port: wsPort});

page.use('/',express.static(__dirname+'/home'))

page.listen(pagePort, data => {
    console.log(data);
    console.log(`Servidor corriendo en el puerto ${pagePort}`);
});

const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const parser = port.pipe(new Readline({delimiter: '\r\n'}));

asignar = (dato) => {
    for( i=15; i <= 18; i++){
        sTemperatura = sTemperatura + dato[i]
    }
}


wss.on('connection', ws => {
    parser.on('data', temp => {
        /*
        if ( temp[4] === '1' ){
            for( i=15; i <= 18; i++){
                sTempOficina = sTempOficina+temp[i];
                console.log(sTempOficina);
            }
        } else if( temp[4] === '2'){

        }*/
        console.log(temp);
        ws.send(temp);
    })
    console.log('Cliente conectado');
})




