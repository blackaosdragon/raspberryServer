const Ws = require('ws');
const express = require('express');
const SerialPort = require('serialport');
const mySql = require('mysql');

let datos_temperatura = require('./asignacion.js');
let mensajes = require('./fcmessage.js');

const page = express();

const wsPort = 5001;
const pagePort = 5000;
let string_ofice_temperature = "";
let float_ofice_temperature = 0.0;
let string_ofice_ID = "";
let integer_alertas = 0;
let alerta = 1;
let alertas_de_un_minuto = 150;


const wss = new Ws.Server({port: wsPort});

page.use('/',express.static(__dirname+'/home'))

page.listen(pagePort, data => {
    //console.log(data);
    console.log(`Servidor corriendo en el puerto ${pagePort}`);
});

const Readline = SerialPort.parsers.Readline;
let port = new SerialPort('/dev/ttyUSB0');
//let puerto_inalambrico = new SerialPort('/dev/ttyUSB1');

const lector = port.pipe(new Readline({delimiter: '\r\n'}));
//const lector_wireless = puerto_inalambrico.pipe(new Readline({delimiter: '\r\n'}));
//let parser = port.pipe(new Readline({delimiter: '\r\n'}));



lector.on('data', temp => {
    console.log(`Alertas: ${alerta} Temp: ${temp}°C`);
    console.log(temp);
    let temperatura = datos_temperatura(temp);
    if (temperatura>24.9){
        alerta++;
        integer_alertas++;

        mensajes.sendPushAlert(temperatura,alerta,integer_alertas);
    } else if (temperatura<24.9){
        alerta=0;
    }
})
/*
lector_wireless.on('data', temp => {
    if (temp === "No se ha recibido datos"){

    } else {
        let temperatura = datos_temperatura(temp);
        console.log(temperatura);
    }
})*/

wss.on('connection', ws => { 
    let parser = port.pipe(new Readline({delimiter: '\r\n'}));
    //let parser_wireless = puerto_inalambrico.pipe(new Readline({delimiter: '\r\n'}));

    /*parser_wireless.on('data', temp => {
        if (temp === "No se ha recibido datos"){

        } else {
            let wireless_temp = datos_temperatura(temp);
            console.log(wireless_temp);
            ws.send(`1 ${wireless_temp}`);
        }
    })*/

    parser.on('data', temp => {
        for(let i = 4; i<=8;i++){
            string_ofice_ID = string_ofice_ID+temp[i];
        }
        let sensor_manual = datos_temperatura(temp);
        let id_sensor = parseFloat(string_ofice_ID);
        ws.send(`${id_sensor} ${sensor_manual}`);
        string_ofice_ID = "";
        
    })
    
    parser.on('close', ()=>{console.log('puerto cerrado')});
    parser.on('end',()=>{console.log('Puerto finalizado')});
    console.log('Cliente conectado'); //metodo para subscribir a un usuario


    ws.on('close',(cliente)=>{
        parser.end(()=>{console.log("lector terminado")})
    })
})
