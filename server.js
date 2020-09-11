const Ws = require('ws');
const express = require('express');
const tokens = require('./querys.js');
const https = require('https');
const fs = require('fs');
const path = require('path');
let asignar = require('./asignacion.js');
let mensajes = require('./fcmessage.js');

let idTemp = 0;
let id2Temp = 0;
let id3Temp = 0;
let idContador = 0;
let idContador2 = 0;
let idContador3 = 0;
let crono1;
let crono2;
let crono3;



const page = express();


let hora_server = new Date();
let horas1Plasmado;
let minutos1Plasmado;
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
        console.log(payload.descargado)
        if(payload.descargado==1){
            console.log(`Se va a borrar el archivo ${name}`);
            return payload.descargado
        } else {
            console.log(`No hubo respuesta y no se borrara el archivo`);
            return 0;
        }
    }).then( borrar => {
        if(borrar){
            fs.unlink(`${name}`, err => {
                if(err){
                    console.log(err);
                } else {}
            })
        } else {
            console.log("EL archivo no se pudo descargar y no se borrara");
        }
    })
    .catch( err => {
        console.log(err);
    })
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
/*cronometro = () => {
    let reloj = new Date();
    let cronoMinutos = parseInt(reloj.getMinutes());
    let cronoSegundos = parseInt(reloj.getSeconds());
    console.log(`${cronoMinutos}:${cronoSegundos}`)
}
setInterval(()=>cronometro(),1000);*/
/*
//if(req.body.temperatura>5){
    let contador = 0;
    temporizador = () => {
        //console.log("Contador: ",contador);
        contador++;
        if(contador%120==0){
            mensajes.test_notification();
        }
    }
    setInterval(()=>temporizador(),1000);
    if(contador%120==0){
        mensajes.test_notification();
    }
//}
*/
page.post('/temperatura',(req,res)=>{
    
    if(req.body.id==1){
        idTemp = parseFloat(req.body.temperatura);
    } else if (req.body.id==2){
        id2Temp = parseFloat(req.body.temperatura);
    } else if (req.body.id==3){
        id3Temp = parseFloat(req.body.temperatura);
    }
    sendTemp = (id) => {
        
        let temp;
        let temp2;
        let temp3;
        //let id ;
        //let ubicacion = asignar.asignar_ubicacion(id);
        let ubicacion;
        if(id==1){
            temp = idTemp;
            
            ubicacion = asignar.asignar_ubicacion(id);
            //mensajes.notificacion_temperatura(temp,ubicacion);
        } else if(id==2){
            temp2 = id2Temp
            
            ubicacion = asignar.asignar_ubicacion(id);
            //mensajes.notificacion_temperatura(temp2,ubicacion);
        } else if(id==3){
            temp3 = id3Temp
            //id = parseInt(req.body.id);
            ubicacion = asignar.asignar_ubicacion(id);
            //mensajes.notificacion_temperatura(temp3,ubicacion);
        }
        
    }
    //console.log(req);
    let registro = new Date();
    let horas = parseInt(registro.getHours());
    let minutos = parseInt(registro.getMinutes());
    let segundos = parseInt(registro.getSeconds());

    
    //crono 1
    if(parseFloat(req.body.temperatura)>5.7 && parseInt(req.body.id)==1 && idContador==0){
        idContador++;
        let tiempo = new Date();
        horas1Plasmado = parseInt(tiempo.getHours());
        minutos1Plasmado = parseInt(tiempo.getMinutes());

        sendTemp(1);

        /*
        crono1 = setInterval(()=>{
            idContador++;
            console.log("Contador 1: ",idContador);
            if(idContador%120==0){
                console.log("Notificacion enviada");
                //sendTemp(1);
                idContador=0;
            }
        },1000);
        */
    } else if(parseFloat(req.body.temperatura)<=5.7 && parseInt(req.body.id)==1 && idContador>0){
        console.log(`Temperatura normal se borra la hora: ${horas1Plasmado}:${minutos1Plasmado}`)
        horas1Plasmado=0;
        minutos1Plasmado=0;
        //clearInterval(crono1);
        idContador=0;
        console.log("Contador detenido")
    }
    //crono 2
    if(parseFloat(req.body.temperatura)>=7.8 && parseInt(req.body.id)==2 && idContador2<=0){
        /*
        crono2 = setInterval(()=>{
            idContador2++;
            console.log("Contador 2: ",idContador2);
            if(idContador2%120==0){
                idContador2=0;
                console.log("Notificacion enviada");
                //let id = parseInt(req.body.id);
                //let ubicacion = asignar.asignar_ubicacion(id);
                //sendTemp(2);
                //mensajes.notificacion_temperatura(req.body.temperatura,ubicacion);
            }
        },1000);
        */
    } else if(parseFloat(req.body.temperatura)<7.8 && parseInt(req.body.id)==2 && idContador2>0){
        idContador2=0;
        //clearInterval(crono2);
        console.log("Contador detenido")
    }
    if(parseFloat(req.body.temperatura)>=7.8 && parseInt(req.body.id)==3 && idContador3<=0){
        /*
        crono3 = setInterval(()=>{
            idContador2++;
            console.log("Contador 2: ",idContador2);
            if(idContador2%120==0){
                idContador2=0;
                console.log("Notificacion enviada");
                //let id = parseInt(req.body.id);
                //let ubicacion = asignar.asignar_ubicacion(id);
                //mensajes.notificacion_temperatura(req.body.temperatura,ubicacion);
                //sendTemp(3);
            }
        },1000);        
        */
    } else if(parseFloat(req.body.temperatura)<7.8 && parseInt(req.body.id)==3 && idContador3>0){
        idContador3 = 0;
        //clearInterval(crono3);
        console.log("Contador detenido");
    }

    if(parseInt(registro.getMinutes())-minutos1Plasmado%2==0){
        console.log("Se va a enviar una alerta");
    }

    
    if(req.body.temperatura>=7.8){
        
        if(minutos%2==0 && segundos%5==0){
            
            let id = parseInt(req.body.id);
            let ubicacion = asignar.asignar_ubicacion(id);
            //mensajes.notificacion_temperatura(req.body.temperatura,ubicacion);
        }
    }
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
    console.log(`ID: ${req.body.id} Temperatura: ${req.body.temperatura} Hora: ${registro.getHours()}:${registro.getMinutes()}:${registro.getSeconds()}`);
    console.log(`Hora de temperatura irregular: ${horas1Plasmado}:${minutos1Plasmado}`);
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
page.post('/insertar_token', (req,res) => {
    console.log("Hizo solicitud de token",req.body.activo);
    console.log(req.body);
    let data = {}
    tokens.insertar_tokens(req.body.token,req.body.activo).then( respuesta => {
        if(respuesta){
            console.log(respuesta)
            res.send(respuesta);
        } else {
            let respuesta = {
                actualizado: 1
            }
            res.send(respuesta)
        }
    }).catch( error => {
        console.log(error);
        data = {
            data: 0
        }
        res.send(data);
    })
    //res.send(data);
})
page.get('/test_notificacion', (req,res) => {
    mensajes.test_notification();
    let mensajes_enviados = {
        data: 1
    }
    res.send(mensajes_enviados);
})




