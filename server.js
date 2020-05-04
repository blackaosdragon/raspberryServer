const Ws = require('ws');
const express = require('express');
const SerialPort = require('serialport');
const mySql = require('mysql');
const admin = require('firebase-admin');
const serviceAccount = require("/home/ubuntu/home-8bea3-firebase-adminsdk-ilfkz-544a451f7b.json");
const url_de_base_de_datos = 'https://home-8bea3.firebaseio.com/'

const page = express();

const wsPort = 5001;
const pagePort = 5000;
const intervalo_entre_alertas = 60000//en milisegundos
let string_ofice_temperature = "";
let float_ofice_temperature = 0.0;
let integer_alertas = 0;
let alerta = 1;
let alertas_de_un_minuto = 150;



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: url_de_base_de_datos
})

const base_de_datos = mySql.createConnection({
    host: 'localhost',
    user: 'infoUpdater',
    password: '107005205',
    database: 'tokens',
})


let tokens = [];

activacion_de_alertas = (float_ofice_temperature,alerta,texto,integer_alertas) => {
    //integer_alertas++;
    //console.log(`Dentro de la funcion: ${float_ofice_temperature}`);
    //console.log(`Alerta en la funcion: ${alerta}`);
    if (alerta > 1){
        //console.log(integer_alertas)
        //console.log(`Se activara notificaciones de ${texto}`);
        if( integer_alertas % alertas_de_un_minuto == 0 ){
            integer_alertas=0;
            let envios = asignar_tokens();
            //console.log(envios);
            //console.log(` ${texto}! La temperatura tiene el valor de ${float_ofice_temperature}`);
            const advertencia = {
                data: {
                    tipo: "Bienvenida",
                    titulo: "¡Advertencia temperaruta inusual!",
                    contenido: `La temperatura se encuentra a ${float_ofice_temperature}°C`
                }
            }
            const options = {
                priority: 'high',
                timeToLive: 60 * 0 * 0
            }
            if (Object.entries(tokens).length === 0){

            } else {
                
                admin.messaging().sendToDevice(envios,advertencia,options)
                .then( response => {
                    console.log('Correcta entrega: ', response);
                }).catch( error => {
                    console.log('Error sending message: ',error);
                })
            }
            
        }
    }
}

asignar_tokens = () => {
    //let tokens = []
    base_de_datos.query("SELECT * FROM Tokens", (err, token, campos) => {
        if (err){
            console.log(err);
        }
        for( let contador = 0; contador < token.length; contador++){
           tokens[contador] = token[contador].token;
           
        }
        //console.log(tokens)
        return tokens;
    })
    //console.log(tokens)
    return tokens;
}
const wss = new Ws.Server({port: wsPort});

page.use('/',express.static(__dirname+'/home'))

page.listen(pagePort, data => {
    console.log(data);
    console.log(`Servidor corriendo en el puerto ${pagePort}`);
});

const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const parser = port.pipe(new Readline({delimiter: '\r\n'}));

let mensaje_push;


wss.on('connection', ws => {
    port.on('connect',()=>{console.log("cliente conectado")})    
    parser.on('data', temp => {
        for(let i = 15; i <= 18; i++){
            string_ofice_temperature = string_ofice_temperature+temp[i];
        }
        ws.send(temp);
        //console.log(`Alerta: ${alerta} `)
        console.log(`Temperatura: ${float_ofice_temperature} Alerta a 150: ${integer_alertas}`);

        float_ofice_temperature = parseFloat(string_ofice_temperature);
        if (float_ofice_temperature > 24.9 && float_ofice_temperature <= 29.9){
            integer_alertas++;
            alerta++;
            //console.log(`Dentro de un if: ${float_ofice_temperature}`);
            activacion_de_alertas(float_ofice_temperature,alerta,"advertencia",integer_alertas); 
            /*
            if(integer_alertas%150==0){
                integer_alertas = 0;
                console.log("1 minuto");
                // let envios = asignar_tokens();  
            }*/
        } else if (float_ofice_temperature<=24.9){
            integer_alertas = 0;
            alerta=0;
            //console.log(`Dentro de un if: ${float_ofice_temperature}`);
        } else if ( float_ofice_temperature > 29.9 ){
            integer_alertas++;
            alerta++;
            //console.log(`Dentro del if: ${float_ofice_temperature}`);
            activacion_de_alertas(float_ofice_temperature,alerta,"alerta",integer_alertas);
        }
        if (alerta == 0){
            //console.log("Se desactivara alerta");;
            clearInterval(mensaje_push);
        }
        //console.log(integer_alertas);
        string_ofice_temperature = "";
    })
    console.log('Cliente conectado'); //metodo para subscribir a un usuario
    ws.on('close',(cliente)=>{
        // console.log("Cliente desconectado",cliente);
        port.close();
        // parser.on('close',()=>console.log("Arduino  close"));
        // parser.on('end',()=>console.log("Arduino  end"));
        // parser.on('disconnect',()=>console.log("Arduino  disconnect"));
        // port.on('close',()=>console.log("Puerto cerrado"));
        // port.on('disconnect',()=>console.log("Puerto desconectado"));
    })
})
