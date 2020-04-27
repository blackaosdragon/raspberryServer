const Ws = require('ws');
const express = require('express');
const SerialPort = require('serialport');
const mySql = require('mysql');

const page = express();

const wsPort = 5001;
const pagePort = 5000;
let string_ofice_temperature = "";
let float_ofice_temperature = 0.0;
let integer_alertas = 0;
/*
const base_de_datos = mySql.createConnection({
    host: 
})
*/


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
    console.log("Cliente conectado")
    parser.on('data', temp => {
        for(let i = 15; i <= 18; i++){
            string_ofice_temperature = string_ofice_temperature+temp[i];
        }

        ws.send(temp);
        float_ofice_temperature = parseFloat(string_ofice_temperature);
        if(integer_alertas%60==0){
            console.log("Alerta");
        }
        console.log(integer_alertas);
        
        string_ofice_temperature = "";
        integer_alertas++;
        
    })
    console.log('Cliente conectado'); //metodo para subscribir a un usuario
    
})








