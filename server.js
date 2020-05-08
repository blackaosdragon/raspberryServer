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
let puerto_inalambrico = new SerialPort('/dev/ttyUSB1');

const lector = port.pipe(new Readline({delimiter: '\r\n'}));
const lector_wireless = puerto_inalambrico.pipe(new Readline({delimiter: '\r\n'}));
//let parser = port.pipe(new Readline({delimiter: '\r\n'}));



lector.on('data', temp => {
    let temperatura = datos_temperatura(temp);
    console.log(`Temperatura Manual${temperatura}`);
    if (temperatura>24.9){
        alerta++;
        integer_alertas++;
        mensajes.sendPushAlert(temperatura,alerta,integer_alertas);
    }
})
lector_wireless.on('data', temp => {
    let temperatura = datos_temperatura(temp);
    console.log(`Temperatura Oficina ${temperatura} `);

})

wss.on('connection', ws => { 
    let parser = port.pipe(new Readline({delimiter: '\r\n'}));
    parser.on('data', temp => {
        
        for(let i = 15; i <= 18; i++){
            string_ofice_temperature = string_ofice_temperature+temp[i];
        }
        ws.send(temp);
        console.log(`Temperatura: ${float_ofice_temperature} Alerta a 150: ${integer_alertas}`);
        float_ofice_temperature = parseFloat(string_ofice_temperature);
        if (float_ofice_temperature > 24.9 && float_ofice_temperature <= 29.9){
            
            alerta++;
            activacion_de_alertas(float_ofice_temperature,alerta,"advertencia",integer_alertas); 
        } else if (float_ofice_temperature<=24.9){
            integer_alertas = 0;
            alerta=0;
        } else if ( float_ofice_temperature > 29.9 ){
            
            alerta++;
            activacion_de_alertas(float_ofice_temperature,alerta,"alerta",integer_alertas);
        }
        string_ofice_temperature = "";
    })
    
    parser.on('close', ()=>{console.log('puerto cerrado')});
    parser.on('end',()=>{console.log('Puerto finalizado')});
    console.log('Cliente conectado'); //metodo para subscribir a un usuario


    ws.on('close',(cliente)=>{
        parser.end(()=>{console.log("lector terminado")})
    })
})
