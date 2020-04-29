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
    //port: '/var/run/mysqld/mysqld.sock',
    user: 'infoUpdater',
    password: '107005205',
    database: 'tokens',
})

let tokens = [];

asignar_tokens = () => {
    //let tokens = []
    tokens = base_de_datos.query("SELECT * FROM Tokens", (err, token, campos) => {
        if (err){
            console.log(err);
        }
        for( let contador = 0; contador < token.length; contador++){
           //console.log(arreglo_de_tokens[contador].token);
           tokens[contador] = token[contador].token;
           //console.log(tokens);
        }
        console.log('Despues de for: ');
        console.log(tokens);
    })
    return tokens;
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
                //tokens = [];
                tokens = asignar_tokens();
                console.log(`Fuera de la funcion: ${tokens[1]}`);    
            }
        } else if (float_ofice_temperature<=24.9){
            integer_alertas = 0;
        }
        console.log(integer_alertas);
        string_ofice_temperature = "";
    })
    console.log('Cliente conectado'); //metodo para subscribir a un usuario
})