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

const base_de_datos = mySql.createConnection({
    host: 'localhost',
    user: 'infoUpdater',
    password: '107005205',
    database: 'tokens'
})

let tokens = [];

asignar_tokens = (arreglo_de_tokens) => {
    for( let contador = 0; contador <= arreglo_de_tokens.length; contador++){
        tokens[contador] = arreglo_de_tokens[contador].token;
    }
}
//
colocar_Tokens = () => {
    base_de_datos.query("SELECT * FROM Tokens",(error,datos,campos) => {

    })
}
//
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
        if (float_ofice_temperature>24.9){
            integer_alertas++;

            if(integer_alertas%60==0){
                
                console.log("alerta");
                integer_alertas = 0;
                tokens = []
                base_de_datos.query("SELECT * FROM Tokens", (err, resultados, campos) => {
                    if (err){
                        console.log(err);
                    }
                    asignar_tokens(resultados);
                    console.log(tokens);
                })
            }
        } else if (float_ofice_temperature<=24.9){
            integer_alertas = 0;
        }
        console.log(integer_alertas);
        string_ofice_temperature = "";
    })
    console.log('Cliente conectado'); //metodo para subscribir a un usuario
})