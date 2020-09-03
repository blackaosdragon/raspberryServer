const Ws = require('ws');
const express = require('express');
/*const SerialPort = require('serialport');*/
const tokens = require('./querys.js');

//const admin = require('firebase-admin');
//const serviceAccount = require("/home/ubuntu/home-8bea3-firebase-adminsdk-ilfkz-544a451f7b.json");
//cambiar la ruta anterir ingresando el archivo y la nueva ruta
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://home-8bea3.firebaseio.com/'
});
*/


const https = require('https');
const fs = require('fs');
const path = require('path');

let asignar = require('./asignacion.js');
//let datos_temperatura = require('./asignacion.js');
let mensajes = require('./fcmessage.js');
const { resolve } = require('path');
const { rejects } = require('assert');
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

/*
const httpServer = https.createServer({
    key: fs.readFileSync(path.resolve('/home/ubuntu/server/certs/private.key')),
    cert: fs.readFileSync(path.resolve('/home/ubuntu/server/certs/certificate.crt'))
   
   },page);

httpServer.listen(puerto,()=>{
  console.log(`Servidor disponible en el puerto ${puerto}`);
})
*/
const httpServer = https.createServer({
    key: fs.readFileSync(path.resolve('/home/pi/Web/raspberry/raspberryServer/certs/private.key')),
    cert: fs.readFileSync(path.resolve('/home/pi/Web/raspberry/raspberryServer/certs/certificate.crt'))
   
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

//const Readline = SerialPort.parsers.Readline;
//let port = new SerialPort('/dev/ttyUSB0'); //la direccion es por el puerto que esta enmtrnado los datos
//let puerto_inalambrico = new SerialPort('/dev/ttyUSB1'); 
//seccion por si habra más antenas o algun otro tipo de sensor

//const lector = port.pipe(new Readline({delimiter: '\r\n'}));
//const lector_wireless = puerto_inalambrico.pipe(new Readline({delimiter: '\r\n'}));
//let parser = port.pipe(new Readline({delimiter: '\r\n'}));

        // lector.on('data', temp => {
        //     //console.log(`${temp} turno: ${turno}`);
        //     let teempo = new Date();
        //     //let extra = "FALSE"
        //     //console.log(`Hora  de actualizacion: ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`)
        //     //console.log(`Hora  de iniciacion: ${hora_server.getHours()} : ${hora_server.getMinutes()} : ${hora_server.getSeconds()}`)
        //     let minuto_refresh = parseInt(teempo.getMinutes());
        //     let temperatura = asignar.string_to_float(temp);
        //     let ubicacion = asignar.ubicar_dato(temp);   
        //     let id = asignar.asignar_id(temp);
        //     if(id==null || id == undefined || Number.isNaN(id)){} else {
        //         if(temperatura==null || temperatura == undefined || Number.isNaN(temperatura)){}else{
        //             temperatura+ajuste;
        //         }
        //     }
        //     if (temperatura>38.9){
        //         alerta++;
        //         integer_alertas++;
        //         console.log(`${alerta} ${integer_alertas}  Temp: ${temp}°C`);
        //         mensajes.sendPushAlert(temperatura,alerta,integer_alertas);
        //         //extra = "TRUE";
        //     } else if (temperatura<38.8){
        //         alerta=0;
        //     }
        //     if(minuto_refresh%15 == 0){
        //         console.log(`Dato`);
        //         //console.log(`${temp} turno: ${turno}`);
        //         if(id==turno){
        //             //console.log(`${temp} turno: ${turno}`);
        //             if(Number.isNaN(temperatura)){
        //                 console.log(`El valor de la temperatura que se quiere ingresar no es un entero: ${temperatura}, es incompatible en la base de datos y no se agregara`);
        //             } else if(temperatura==undefined){
        //                 console.log(`El valor de la temperatura que se quiere ingresar es ${temperatura}, no es compatible a la base de datos y no se agregara`);
        //             } else if(temperatura==null) {
        //                 console.log(`El valor de la tamperatura es ${temperatura}`)
        //             } else if (id == undefined || id == null || Number.isNaN(id)){
        //                 console.log(`El id que se quiere  es ${id} no es valido y no se agregara a la base de datos`);
        //             } else {
        //                 //console.log(`${temp} turno: ${turno}`);
        //                 //console.log(`Entrando al ciclo y revisando si hay un dato repetido. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
        //                 tokens.buscar_repetido(turno).then(response=>{
        //                     console.log(`Tamaño de la respuesta: ${response.length}`);
        //                     if(response.length>0){
        //                         console.log(`Para el id ${id} ya existe un dato guardado. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
        //                     } else {
        //                         console.log(`En el turno ${turno} se guardo: ${ubicacion} a ${temperatura} id: ${id}. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
        //                         tokens.insertar_valores(temperatura,ubicacion,id);
        //                     }
        //                 }).catch(err=>{
        //                     console.log(err);
        //                 })
        //             }
        //         } 
        //         turno++;
        //         if(sensores_en_total<turno){
        //             turno=1;
        //         }
        //     } else {
        //         turno=1;
        //     }
        // })

const io = require('socket.io')(httpServer);

//const ioLector = port.pipe(new Readline({delimiter: '\r\n'}));

        // ioLector.on('data',temp=>{    
        //     for(let i = 4; i<=8;i++){
        //         string_ofice_ID = string_ofice_ID+temp[i];
        //     }
        //     let id_sensor = parseFloat(string_ofice_ID);
        //     let sensor_manual = asignar.string_to_float(temp);
        //     if(sensor_manual == null || sensor_manual == undefined || Number.isNaN(sensor_manual) || sensor_manual == 'NaN' || id_sensor==null || id_sensor == undefined || Number.isNaN(id_sensor)){
        //         console.log(`Temperatura "${temp}" no es valida para emitirse`);
        //     } else {
        //         sensor_manual+ajuste;
        //         io.emit('temp',`${id_sensor} ${sensor_manual}`);
        //     }
            
        //     string_ofice_ID = "";
        // });

        // wss.on('connection', ws => { 
        //     let parser = port.pipe(new Readline({delimiter: '\r\n'}));
        //     //let parser_wireless = puerto_inalambrico.pipe(new Readline({delimiter: '\r\n'}));

        //     /*parser_wireless.on('data', temp => {
        //         if (temp === "No se ha recibido datos"){

        //         } else {
        //             let wireless_temp = datos_temperatura(temp);
        //             console.log(wireless_temp);
        //             ws.send(`1 ${wireless_temp}`);
        //         }
        //     })*/

        //     parser.on('data', temp => {
        //         for(let i = 4; i<=8;i++){
        //             string_ofice_ID = string_ofice_ID+temp[i];
        //         }
        //         let sensor_manual = asignar.string_to_float(temp);
        //         let id_sensor = parseFloat(string_ofice_ID);
        //         //io.emit(`${id_sensor} ${sensor_manual}`)
        //         ws.send(`${id_sensor} ${sensor_manual}`);
        //         string_ofice_ID = "";
                
        //     })
            
        //     parser.on('close', ()=>{console.log('Puerto cerrado')});
        //     parser.on('end',()=>{console.log('Puerto finalizado')});
        //     console.log('Cliente conectado'); //metodo para subscribir a un usuario
        //     ws.on('close',(cliente)=>{
        //         parser.end(()=>{console.log("lector terminado")})
        //     })
        // })
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
    tokens.extraer_ubicacion().then(respuesta=>{
        console.log(respuesta);
        res.send(respuesta);
    })
    //io.emit(`Data Server`);
})
page.get('/ubicaciones2',(req,res)=>{
    console.log('Solicitando ubicaciones');
    tokens.extraer_ubicaciones().then( respuesta => {
        console.log(respuesta);
        res.send(respuesta);
    })
    //io.emit(`Data Server`);
})
page.get('/hospitales', (req,res) =>{
    console.log("Solicitando Hospitales");
})

page.get('/socket', (req,res) => {
    console.log('Se recibio el get');
    //tokens.consultar_base();
    /*
    tokens.obtener_datos().then(respuesta=>{
        console.log("Enviando respuesta");
        res.send(respuesta);
    })
    */
    tokens.emitir_datos().then( respuesta => {
        console.log("Ejecutando promesa");
        res.send(respuesta)
    });
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
    }).then(name=>{
        console.log(`Proporcionando el nombre: ${name} para consultar la case de datos`)
        tokens.consultar_base_de_datos(lugar,year,mes,dia,name)
        .then(respuesta=>{
            console.log(`Despues de llenar el archivo: ${name}`);
            res.send(respuesta);
        });
    })
    
    
})
page.get('/descarga_consulta', (req,res)=>{
    function descarga(){
        return new Promise( (resolve,reject) => {
            res.download(`${name}`,`${name}`, err => {
                if(err){
                    console.log(err);
                    reject(err);
                } else {
                    let payload = {
                        descargado: 1
                    }
                    resolve(payload);
                }
            })
        })
    }
    descarga().then( (payload)=> {
        console.log(`Descarga del archivo ${name}, realizada!`);
        console.log(payload);
        return payload;
    }).then(payload => {
        console.log(payload.descarga)
        if(payload.descarga==1){
            console.log(`Se va a borrar el archivo ${name}`)
        } else {
            console.log(`No hubo respuesta y no se borrara el archivo`);
        }
    })
    .catch( err => {
        console.log(err);
    })
    
    
    /*
    res.download(`${name}`,`${name}`, err => {
        if(err){
            console.log(err);
        } else {

        }
    });
    */
    /*
    descarga = () => {
        return new Promise( (resolve,reject) => {
            console.log(`Preparando para descargar el archivo: ${name}`);
            
            resolve(`${name}`);
        })
    };
    descarga().then( name => {
        console.log(name);
        res.download(`${name}`,`${name}`);
        return(name);
    }).then( name => {
        console.log(`Archivo descargado: ${name}`);
        return name;
    }).then( name => {
        console.log(`Borrando archivo: ${name}`);
        return (name)
    }).then( name => {
        fs.unlinkSync(`${name}`,(err)=>{
            if(err){
                console.log(err);
            } else {
                console.log("Archivo borrado por la funcion promesa");
            }
            
        })         
    })
    console.log(`El archivo a descargar es: ${name}`)
    let promesa_descarga = new Promise ((resolve,reject)=>{
        res.download(`${name}`,`${name}`, err => {
            if (err){
                reject();
            } else {
                console.log("Archivo descargado");
                resolve();
            }
        })
    })
    promesa_descarga.then(()=>{
        console.log("Termino la promesa");
        res.download(`${name}`,`${name}`);
    }).then( () => {
        console.log("Preparando para borrar archivo");
        fs.unlink(`${name}`,(err)=>{
            if(err){
                console.log(err);
            } else {
                console.log("Archivo borrado");
            }
            
        })        
    })
    .catch( err => {
        console.log(err);
    })*/



    /*
    res.download(`${name}`,`${name}`, err => {
        if(err){
            console.log(err);
            let payload = {
                descarga: 0
            }
            //res.send(payload);
        } else {
            console.log("Antes de eliminarlo");
            console.log("Eliminado");
        }
    });
    console.log("Archivo descargado");
    */
    
    /////////////////////////////////////////////


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
    */



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
    */
})

page.post('/years', (req,res) => {
    console.log("Solicitando años")
    let ubicacion = req.body.ubicacion;
    console.log("Ubicacion fuera de la base: ",ubicacion);
    tokens.extraer_años(ubicacion).then( respuesta => {
        res.send(respuesta);
    })
})
page.post('/login',(req,res)=>{
    console.log(req.body);
    tokens.validar_login(req.body.user,req.body.pass).then((logueado)=>{
        console.log(logueado)
        res.send(logueado);
    })
    //res.send('Recibido');
})
//page.use('/.well-known/pki-validation/',express.static('verifi'));


page.post('/temperatura',(req,res)=>{
    //console.log(req);
    let registro = new Date();
    let horas = parseInt(registro.getHours());

    console.log(`ID: ${req.body.id} Temperatura: ${req.body.temperatura} Hora: ${registro.getHours()}:${registro.getMinutes()}:${registro.getSeconds()}`);
    if(Number.isNaN(req.body.temperatura)){
        console.log(`El dato: ${req.body.temperatura}, no es un numero`);
        let bad = {
            data: 'recibido pero fallo'
        }
        res.send(bad);
    } else if (Number.isNaN(req.body.id)){
        console.log(`El dato: ${req.body.id}, no es un numero y no se agregara`);
        let bad = {
            data: 'recibido pero fallo'
        }
        res.send(bad);
    } else if (req.body.temperatura!=-127){
        let id = parseInt(req.body.id);
        let ubicacion = asignar.asignar_ubicacion(id);
        //tokens.insertar_valores(req.body.temperatura,ubicacion,id);
        if ( horas%2==0 ){
            console.log("Hora par se guardará dato");
            tokens.buscar_repetido(req.body.id).then( response => {
                console.log(`Tamaño de la respuesta: ${response.length}`);
                if( response.length > 0 ){
                    console.log(`Ya existe un dato para el id: ${req.body.id}`);
                    //console.log(response);
                    let good2 = {
                        data: 'recibido pero ya no se guardará'
                    }
                    res.send(good2);                    
                } else {
                    console.log('Se agregará el dato');
                    if(req.body.id==2){
                        let temp = req.body.temperatura - 2;
                        io.emit('temp',`${req.body.id} ${temp}`);
                        tokens.insertar_valores_2hour(temp,ubicacion,id);
                        tokens.insertar_valores(temp,ubicacion,id);
                    } else {
                        tokens.insertar_valores_2hour(req.body.temperatura,ubicacion,id);
                        tokens.insertar_valores(req.body.temperatura,ubicacion,id);
                    }
                    let good = {
                        data: 'recibido y guardado'
                    }
                    res.send(good);
                }
            })
        }
        io.emit('temp',`${req.body.id} ${req.body.temperatura}`);
    } else {
        io.emit('temp',`${req.body.id} ${req.body.temperatura}`);
        //console.log(`La temperatura ${req.body.temperatura} para el id: ${req.body.id} no es valida`);
    }
})
let response = {
    data: 'recibido'
}
page.get('/test',(req,res)=>{
    console.log('Se pudo hacer el get');
    res.send(response);
})
page.get('/descarga_csv',(req,res)=>{
    tokens.obtener_nombre(lugar,year,mes,dia).then(respuesta=>{
        console.log(`Obteniendo el nombre: ${respuesta}`);
        name = respuesta;
        return respuesta;
    })
    res.download(`${name}`,`${name}`);
    res.send(name);
})



