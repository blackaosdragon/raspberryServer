const Ws = require('ws');
const express = require('express');
const SerialPort = require('serialport');
const mySql = require('mysql');
const tokens = require('./querys.js');



const https = require('https');
const fs = require('fs');
const path = require('path');

let asignar = require('./asignacion.js');
//let datos_temperatura = require('./asignacion.js');
let mensajes = require('./fcmessage.js');

const page = express();


let hora_server = new Date();


const wsPort = 5001;
const pagePort = 5000;
const puerto = 443;
let string_ofice_temperature = "";
let float_ofice_temperature = 0.0;
let string_ofice_ID = "";
let integer_alertas = 0;
let alerta = 1;

let timer = 0;


const httpServer = https.createServer({
    key: fs.readFileSync(path.resolve('/home/ubuntu/server/certs/private.key')),
    cert: fs.readFileSync(path.resolve('/home/ubuntu/server/certs/certificate.crt'))
   
   },page);

httpServer.listen(puerto,()=>{
  console.log(`Servidor disponible en el puerto ${puerto}`);
})



const wss = new Ws.Server({port: wsPort});
page.use(express.json());
page.use(express.static(__dirname+'/static', {dotfiles: 'allow'}))

page.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})
page.use('/',express.static(__dirname+'/home'))


/*
const server = page.listen(pagePort, data => {
    //console.log(data);
    console.log(`Servidor corriendo en el puerto ${pagePort}`);
});
//este seccion de codigo es cuando el servidor https no sirve
*/

const Readline = SerialPort.parsers.Readline;
let port = new SerialPort('/dev/ttyUSB0'); //la direccion es por el puerto que esta enmtrnado los datos
//let puerto_inalambrico = new SerialPort('/dev/ttyUSB1'); 
//seccion por si habra más antenas o algun otro tipo de sensor

const lector = port.pipe(new Readline({delimiter: '\r\n'}));
//const lector_wireless = puerto_inalambrico.pipe(new Readline({delimiter: '\r\n'}));
//let parser = port.pipe(new Readline({delimiter: '\r\n'}));

lector.on('data', temp => {
    //console.log(temp);
    let teempo = new Date();
    //let extra = "FALSE"
    //console.log(`Hora  de actualizacion: ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`)
    //console.log(`Hora  de iniciacion: ${hora_server.getHours()} : ${hora_server.getMinutes()} : ${hora_server.getSeconds()}`)
    let minuto_refresh = parseInt(teempo.getMinutes());
    let segundo_refresh = parseInt(teempo.getSeconds());
    let temperatura = asignar.string_to_float(temp);
    let ubicacion = asignar.ubicar_dato(temp);   
    let id = asignar.asignar_id(temp);
    if (temperatura>28.9){
        alerta++;
        integer_alertas++;
        console.log(`${alerta} ${integer_alertas}  Temp: ${temp}°C`);
        mensajes.sendPushAlert(temperatura,alerta,integer_alertas);
        //extra = "TRUE";
    } else if (temperatura<24.9){
        alerta=0;
    }
    if(minuto_refresh%15 == 0){
        if(segundo_refresh>=0 && segundo_refresh<=3){
            if(Number.isNaN(temperatura)){
                console.log(`El numero que se quiere ingresar es ${temperatura}, es incompatible a la base de datos y no se agregara`);
            } else if(temperatura==undefined){
                console.log(`El numero que se quiere ingresar es ${temperatura}, no es compatible a la base de datos y no se agregara`);
            } else {
                tokens.insertar_valores(temperatura,ubicacion,id);
                console.log("data agragada a la DB");
            }
        }
    }
    
})

const io = require('socket.io')(httpServer);

const ioLector = port.pipe(new Readline({delimiter: '\r\n'}));

ioLector.on('data',temp=>{    
    for(let i = 4; i<=8;i++){
        string_ofice_ID = string_ofice_ID+temp[i];
    }
    let id_sensor = parseFloat(string_ofice_ID);
    let sensor_manual = asignar.string_to_float(temp);
    io.emit('temp',`${id_sensor} ${sensor_manual}`);
    string_ofice_ID = "";
});

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
        let sensor_manual = asignar.string_to_float(temp);
        let id_sensor = parseFloat(string_ofice_ID);
        //io.emit(`${id_sensor} ${sensor_manual}`)
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
page.get('/consulta',(req,res)=>{
    console.log('Solicitando años');
    //let data = tokens.extraer_años();
    tokens.extraer_datos().then((data=>{
        console.log(data);
        res.send(data);
    }))    
})
page.post('/mes',(req,res)=>{
    console.log('Solicitando meses');
    let data = req.body;
    console.log(data);
    tokens.extraer_mes(data.year).then(respuesta => {
        res.send(respuesta);
    })
})
page.post('/dia',(req,res)=>{
    console.log('Solicitando dias');
    let data = req.body
    console.log(data.year);
    console.log(data.mes);
    tokens.extraer_dia(data.year,data.mes).then(respuesta=>{
        res.send(respuesta);
    })
})
page.post('/days', solocitar_dias = (req, res) => {
    let mes = req.body.mes
    let ubicacion = req.body.ubicacion
    let year = req.body.year
    console.log(`Mes: ${mes}, ubicacion: ${ubicacion}, año: ${year}`);
    tokens.extraer_dias(mes,year,ubicacion).then( respuesta => {
        res.send(respuesta);
    })
})
page.get('/ubicaciones',(req,res)=>{
    console.log('Solicitando ubicaciones');
    tokens.extraer_ubicacion().then(respuesta=>{
        res.send(respuesta);
    })
})
page.post('/buscar',(req,res)=>{
    let data = req.body
    let year = data.year;
    let mes = data.mes;
    let dia = data.dia;
    let lugar = data.lugar;
    let hora_inicio = data.horas;
    let minuto_inicio = data.minutos;
    let hora_final = data.horaFinal;
    let minuto_final = data.minutoFinal;
    console.log(` Lugar: ${lugar} ${dia}/${mes}/${year} ${hora_inicio}:${minuto_inicio} - ${hora_final}:${minuto_final}`);
    tokens.consultar_base_de_datos(lugar,year,mes,dia,hora_inicio,minuto_inicio,hora_final,minuto_final).then(respuesta=>{
        res.send(respuesta);
    });
    
})
page.post('/years', (req,res) => {
    console.log("Solicitando años")
    let ubicacion = req.body.ubicacion;
    console.log("Ubicacion fuera de la base: ",ubicacion);
    tokens.extraer_años(ubicacion).then( respuesta => {
        res.send(respuesta);
    })
})
page.use('/.well-known/pki-validation/',express.static('verifi'));


