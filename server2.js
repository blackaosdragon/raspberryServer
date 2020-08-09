const Ws = require('ws');
const express = require('express');
const SerialPort = require('serialport');
//const mySql = require('mysql');
const tokens = require('./querys.js');



const https = require('https');
const fs = require('fs');
const path = require('path');

let asignar = require('./asignacion.js');
//let datos_temperatura = require('./asignacion.js');
let mensajes = require('./fcmessage.js');
//const { pbkdf2 } = require('crypto');
//const { response } = require('express');

const page = express();


let hora_server = new Date();
let name;

const ajuste = 3.3;

const wsPort = 5001;
const pagePort = 5000;
const puerto = 443;
const sensores_en_total = 3;
let string_ofice_temperature = "";
let float_ofice_temperature = 0.0;
let string_ofice_ID = "";
let integer_alertas = 0;
let alerta = 1;
let turno = 1;


let timer = 0;

page.listen(pagePort, () => {
    //console.log(data);
    console.log(`Servidor corriendo en el puerto ${pagePort}`);
})

/*

const httpServer = https.createServer({
    key: fs.readFileSync(path.resolve('/home/ubuntu/server/certs/private.key')),
    cert: fs.readFileSync(path.resolve('/home/ubuntu/server/certs/certificate.crt'))
   
   },page);

httpServer.listen(puerto,()=>{
  console.log(`Servidor disponible en el puerto ${puerto}`);
})


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

const io = require('socket.io')(httpServer);

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
    console.log(` Lugar: ${lugar} ${dia}/${mes}/${year}`);
    tokens.obtener_nombre(lugar,year,mes,dia).then(respuesta=>{
        console.log(`Obteniendo el nombre: ${respuesta}`);
        name = respuesta;
        return respuesta;
    })
    .then(name=>{
        console.log(`Proporcionando el nombre: ${name} para consultar la case de datos`)
        tokens.consultar_base_de_datos(lugar,year,mes,dia,name)
        .then(respuesta=>{
            console.log(`Despues de llenar el archivo: ${name}`);
            res.send(respuesta);
        });
    })
    
    
})
page.get('/descarga_consulta', (req,res)=>{
    console.log(`El archivo a descargar es: ${name}`)
    res.download(`${name}`,`${name}`);
    console.log("Archivo descargado");


    //page.use('/',express.static(__dirname+'/home'))
    //res.download('/home/ubuntu/server/',`${name}`),`${name}`);

    //res.download(`/${name}`,'consulta.csv');
    //res.send("Respuesta");
    //res.sendFile(`/home/ubuntu/server/${name}`);
    //console.log(`Descargando ${name}`);
    /*
    return new Promise ((resolve,reject)=>{
        res.download(name);
        resolve(name);
        console.log("descargando archivo");
    })
    
    */
    /*
    fs.unlink(name,(err)=>{
        if(err){
            throw err;
        }
        console.log(`${name} borrado`);
    })
    
})
*/
/*
page.post('/years', (req,res) => {
    console.log("Solicitando años")
    let ubicacion = req.body.ubicacion;
    console.log("Ubicacion fuera de la base: ",ubicacion);
    tokens.extraer_años(ubicacion).then( respuesta => {
        res.send(respuesta);
    })
})
page.post('/login',(req,res)=>{
    //console.log(req.body);
    tokens.validar_login(req.body.user,req.body.pass).then((logueado)=>{
        console.log(logueado)
        res.send(logueado);
    })
    //res.send('Recibido');
})
//page.use('/.well-known/pki-validation/',express.static('verifi'));
*/
let response = {
    data: 'recibido'
}
page.post('/temperatura',(req,res)=>{
    //console.log(req);
    console.log(req.data);
    res.send(response);
})