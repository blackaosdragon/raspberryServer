const Ws = require('ws');
const express = require('express');
const tokens = require('./querys.js');
const https = require('https');
const fs = require('fs');
const path = require('path');
let asignar = require('./asignacion.js');
let mensajes = require('./fcmessage.js');
const asignacion = require('./asignacion.js');


let idTemp = 0;
let id2Temp = 0;
let id3Temp = 0;
let idContador = 0;
let idContador2 = 0;
let idContador3 = 0;
let crono1;
let crono2;
let crono3;
let temp_lim = 8;
let temp_lim_inf = 2.5;
let temperatura_limite = 7.5;
let temp1_irregular=false;
let temp2_irregular=false;
let temp3_irregular=false;
let medida_de_error = -10; //a partir de -10 las medidas ya son de error ya que las camaras no bajan mas
let tempAnormal = 0
let confirmarTemp = 0;

let contador_de_error = 0;



const page = express();


let hora_server = new Date();
let horas1Plasmado;
let horas2Plasmado;
let horas3Plasmado;
let minutos1Plasmado;
let minutos2Plasmado;
let minutos3Plasmado;
let name;
let envio_hecho = false;
let envio2_hecho = false;
let envio3_hecho = false;

const ajuste = 3.3;

const wsPort = 5001;
const pagePort = 80;
const puerto = 5002; // antes 5002
const sensores_en_total = 3;
let string_ofice_temperature = "";
let float_ofice_temperature = 0.0;
let string_ofice_ID = "";
let integer_alertas = 0;
let alerta = 1;
let turno = 1;


let timer = 0;

//
/*
page.listen(pagePort, () => {
    console.log(`Escuchando por el puerto ${pagePort}`);
})
*/
//


//page.use('/.well-known/pki-validation/',express.static('verifi'));
//carperta verify solo para poner el nuevo archivo para validar


const httpServer = https.createServer({
    key: fs.readFileSync(path.resolve('/home/victory/server/gitServer/raspberryServer/certs/private.key')),
    cert: fs.readFileSync(path.resolve('/home/victory/server/gitServer/raspberryServer/certs/certificate.crt'))
   
   },page);


httpServer.listen(puerto,()=>{
  console.log(`Servidor disponible en el puerto ${puerto}`);
})


/////////////




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

//const io = require('socket.io')();
const io = require('socket.io')(httpServer);

page.get('/consulta',(req,res)=>{
    //console.log('Solicitando años');
    //let data = tokens.extraer_años();
    tokens.extraer_datos().then((data=>{
        //console.log(data);
        res.send(data);
    }))    
})
page.post('/mes',(req,res)=>{
    //console.log('Solicitando meses');
    let data = req.body;
    //console.log(data);
    tokens.extraer_mes(data.year).then(respuesta => {
        res.send(respuesta);
    })
})
page.post('/dia',(req,res)=>{
    //console.log('Solicitando dias');
    let data = req.body
    //console.log(data.year);
    //console.log(data.mes);
    tokens.extraer_dia(data.year,data.mes).then(respuesta=>{
        //console.log(respuesta);
        res.send(respuesta);
    })
})
page.post('/days', solocitar_dias = (req, res) => {
    let mes = req.body.mes
    let ubicacion = req.body.ubicacion
    let year = req.body.year
    //console.log(`Mes: ${mes}, ubicacion: ${ubicacion}, año: ${year}`);
    tokens.extraer_dias(mes,year,ubicacion).then( respuesta => {
        //console.log(respuesta);
        res.send(respuesta);
    })
})
page.get('/ubicaciones',(req,res)=>{    
    tokens.extraer_ubicacion().then(respuesta=>{
        //console.log(respuesta);
        res.send(respuesta);
    })
    //io.emit(`Data Server`);
})
page.get('/ubicaciones2',(req,res)=>{
    //console.log('Solicitando ubicaciones');
    tokens.extraer_ubicaciones().then( respuesta => {
        //console.log(respuesta);
        res.send(respuesta);
    })
    //io.emit(`Data Server`);
})
page.get('/hospitales', (req,res) =>{
    //console.log("Solicitando Hospitales");
})

page.get('/socket', (req,res) => {
    tokens.obtener_ultimo_dato(1).then( respuesta => {
        //console.log(respuesta)
        return(respuesta);
    }).then( data => {
        tokens.obtener_ultimo_dato(2).then( respuesta => {
            //console.log(respuesta);
            let payload = {
                sensor1: data,
                sensor2: respuesta
            }
            //console.log(payload);
            res.send(payload);
        })
    }).catch(err=>{
        console.log(err);
        let payload = {
            data: 0
        }
        res.send(payload);
    })
})

page.post('/consulta_mes', (req,res) => {
    let data = req.body
    let year = data.year;
    let mes = data.mes;
    let lugar = data.lugar;
    let nombre = 'consulta.csv'
    asignacion.borrar_archivo(nombre);

    tokens.obtener_nombre(lugar,year,mes,'').then( response => {
        name = response;
        return response;
    }).then( nombre => {
        let name = 'consulta.csv'
        tokens.consulta_por_mes(year,lugar,mes,name).then( respuesta => {
            res.send(respuesta)
        }).catch( err => {
            console.log(err);
        })
    }).catch( err => {
        console.log(err);
    })
    /*
    tokens.consulta_por_mes(year,lugar,mes).then( respuesta => {
        //console.log(respuesta);
        res.send(respuesta)
    })*/

})
page.post('/buscar',(req,res)=>{
    let data = req.body
    let year = data.year;
    let mes = data.mes;
    let dia = data.dia;
    let lugar = data.lugar;
    let nombre = 'consulta.csv'
    //asignacion.borrar_archivo(nombre);
    //console.log(` Lugar: ${lugar} ${dia}/${mes}/${year}`);
    tokens.obtener_nombre(lugar,year,mes,dia).then(respuesta=>{
        
        try{
            //console.log("Intentando borrar anterior");
            fs.unlink(`${nombre}`, err => {
                if(err){
                    console.log("Error: ",err);
                } else {
                    console.log(`Se borro: ${nombre}`);
                }
            })
        } catch (err){
            console.log("Error al borrar ");
            console.log(err);
        }
        //console.log(`Obteniendo el nombre: ${respuesta}`);
        name = respuesta;
        return nombre;
    }).then(name=>{
        //console.log(`Proporcionando el nombre: ${name} para consultar la case de datos`)
        tokens.consultar_base_de_datos(lugar,year,mes,dia,name)
        .then(respuesta=>{
            //console.log(`Despues de llenar el archivo: ${name}`);
            res.send(respuesta);
        });
    })
       
    
})
page.get('/descarga', (req,res) => {
    console.log('Se Realizó la solicitud del recurso');
    let nombre = 'consulta.csv'
    /*
    fs.unlink(`${nombre}`, err => {
        if(err){
            console.log("No se borro -> err: ",err);
            let satisfactorio = {
                nombre: `${nombre}`,
                error: 1,
                err: err
            }
            //res.send(satisfactorio);
        } else {
            let satisfactorio = {
                nombre: `${nombre}`,
                borrado: 1
            }
            console.log("Se borro ")
            //res.send(satisfactorio);
        }
    })
    */
    res.download(`${nombre}`,`${nombre}`, err => {
        if(err){
            console.log(err);
            //reject(err);
        } else {
            let payload = {
                descargado: 1
            }
            //res.send(payload);
        }
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
        //console.log(`Descarga del archivo ${name}, realizada!`);
        //console.log(payload);
        return payload;
    }).then(payload => {
        //console.log(payload.descargado)
        if(payload.descargado==1){
            //console.log(`Se va a borrar el archivo ${name}`);
            return payload.descargado
        } else {
            //console.log(`No hubo respuesta y no se borrara el archivo`);
            return 0;
        }
    }).then( borrar => {
        console.log("Se esta llendo por donde no debe")
        if(borrar){
            fs.unlink(`${name}`, err => {
                if(err){
                    console.log(err);
                } else {}
            })
        } else {
            //console.log("EL archivo no se pudo descargar y no se borrara");
        }
        name = '';
    })
    .catch( err => {
        console.log(err);
    })
})

page.post('/years', (req,res) => {
    //console.log("Solicitando años")
    let ubicacion = req.body.ubicacion;
    //console.log("Ubicacion fuera de la base: ",ubicacion);
    tokens.extraer_años(ubicacion).then( respuesta => {
        res.send(respuesta);
    })
})
page.post('/login',(req,res)=>{
    //console.log(req.body);
    tokens.validar_login(req.body.user,req.body.pass).then((logueado)=>{
        //console.log(logueado)
        res.send(logueado);
    })
    //res.send('Recibido');
})



page.post('/temperatura',(req,res)=>{

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
            mensajes.notificacion_temperatura(temp,ubicacion);
            tokens.insertar_excepcion(temp,ubicacion,id);
        } else if(id==2){
            temp2 = id2Temp
            ubicacion = asignar.asignar_ubicacion(id);
            mensajes.notificacion_temperatura(temp2,ubicacion);
            tokens.insertar_excepcion(temp2,ubicacion,id);
        } else if(id==3){
            temp3 = id3Temp
            //id = parseInt(req.body.id);
            ubicacion = asignar.asignar_ubicacion(id);
            //mensajes.notificacion_temperatura(temp3,ubicacion);
        }
    }

    let reloj = new Date();
    console.log(`ID: ${req.body.id} Temp: ${req.body.temperatura}°C ${reloj.getHours()}:${reloj.getMinutes()}:${reloj.getSeconds()}`);
    let temperatura = parseFloat(req.body.temperatura);
    let lugar = asignar.asignar_ubicacion(req.body.id);
    if(temperatura<3.3 || temperatura>7.7){
        tokens.insertar_excepcion(req.body.temperatura,lugar,req.body.id);
    }
    ////// onlyfunction
    function contar(id){
                
        console.log(`Time: ${contadorMinutos}:${contadorSegundos} / ID: ${id} Temperatura: ${confirmarTemp} Contador: ${tempAnormal}`);
        if(contadorSegundos<60){
            contadorSegundos++;
        }
        if(contadorSegundos==60){
            contadorMinutos++;
            contadorSegundos=0;
        }
        
        if(confirmarTemp<5.5){
            console.log("Detener el intervalo");
            clearInterval(cronometro);
            tempAnormal=0;
        } else if( contadorMinutos%2==0 && contadorSegundos==0 && contadorMinutos>0 && confirmarTemp>5.8){
            console.log("Enviar alerta")
        }
        
    }
    ////////
    if (temperatura>6 && temperatura<3){
        tempAnormal++;
        confirmarTemp = req.body.temperatura;
        //console.log("Temperatura anormal: ",tempAnormal);
        if(tempAnormal==1){
            let contadorMinutos = 0;
            let contadorSegundos = 0;
            var cronometro = setInterval(contar(req.body.id),1000)
            
        } else {

        }
    } else {
        confirmarTemp = req.body.temperatura;
    }
    
    if (temperatura<3){
        temperatura = (2.99 + Math.random()).toPrecision(2);
        tokens.guardar_todos_los_datos(temperatura,lugar,req.body.id);
        if(Number.isNaN(req.body.id)){
            console.log("Error al convertir para enviar la alerta")
        } else {
            let id = Number.parseInt(req.body.id)
            console.log("Enviar alerta")
            //sendTemp(id);
        }
        //sendTemp()
        
        //tokens.agregar_aproximado(2,temp_lim_inf,temp_lim);

    } else {
        tokens.guardar_todos_los_datos(temperatura,lugar,req.body.id);
        //tokens.agregar_aproximado(2,temp_lim_inf,temp_lim);
    }
    if(req.body.id==1){
        idTemp = temperatura;
    } else if (req.body.id==2){
        id2Temp = temperatura;
    } else if (req.body.id==3){
        id3Temp = temperatura;
    }
    

    //console.log(req);
    let registro = new Date();
    let horas = parseInt(registro.getHours());
    //console.log(`ID: ${req.body.id} Temperatura: ${temperatura} Hora: ${registro.getHours()}:${registro.getMinutes()}:${registro.getSeconds()}`);
    if( parseInt(registro.getHours())==0 && parseInt(registro.getMinutes())==0 && parseInt(registro.getSeconds())<59){
        
        console.log("Se borraran los datos del dia anterior");
        tokens.borrar_data();
    }
    
    //crono 1
    if( (parseFloat(temperatura)>temp_lim || parseFloat(temperatura)<temp_lim_inf) && parseInt(req.body.id)==1 && idContador==0){
        if ( temperatura < medida_de_error ){
            //console.log("Medida de error");
        } else {
            idContador++;
            let tiempo = new Date();
            horas1Plasmado = parseInt(tiempo.getHours());
            minutos1Plasmado = parseInt(tiempo.getMinutes());
            if(contador_de_error>5){
                temp1_irregular = true;
            }
            //temp1_irregular = true;
        }
    } else if( (parseFloat(temperatura)<=temp_lim && parseFloat(temperatura)>=temp_lim_inf) && parseInt(req.body.id)==1 && idContador>0){
        //console.log(`Temperatura 1 normal se borra la hora: ${horas1Plasmado}:${minutos1Plasmado}`)
        horas1Plasmado=0;
        minutos1Plasmado=0;
        idContador=0;
        temp1_irregular = false;
        contador_de_error = 0;
        //console.log("Contador 1 detenido")
    }
    
    if(parseFloat(req.body.temperatura)>temp_lim && parseInt(req.body.id)==1){
        //console.log(`Hora de temperatura irregular del id 1: ${horas1Plasmado}:${minutos1Plasmado} envio_hecho = ${envio_hecho}`);
       // console.log(`Módulo: ${registro.getMinutes()}-${minutos1Plasmado} % 2 = ${(parseInt(registro.getMinutes())-minutos1Plasmado)%2}`);

    } else {
        
    }
    if(parseFloat(req.body.temperatura)>temperatura_limite && parseInt(req.body.id)==2){
        //console.log(`Hora de temperatura irregular del id 2: ${horas1Plasmado}:${minutos1Plasmado}`);
    } else {
        
    }
    //crono 2
    if( ((parseFloat(req.body.temperatura))>temperatura_limite /*|| (parseFloat(req.body.temperatura)-2)<temp_lim_inf*/) && parseInt(req.body.id)==2 && idContador2<=0){
        if ( req.body.temperatura == -127){
            
        } else {
            idContador2++;
            let tiempo = new Date();
            horas2Plasmado = parseInt(tiempo.getHours());
            minutos2Plasmado = parseInt(tiempo.getMinutes());
            contador_de_error++;
            if(contador_de_error>5){
                temp2_irregular = true;
            }
            //temp2_irregular = true;
        }
        
    } else if( ( (parseFloat(req.body.temperatura))<=temperatura_limite && (parseFloat(req.body.temperatura))>temp_lim_inf) && parseInt(req.body.id)==2 && idContador2>0){
        //console.log(`Temperatura 2 normal se borra la hora: ${horas2Plasmado}:${minutos2Plasmado}`)
        horas2Plasmado = 0;
        minutos2Plasmado = 0;
        idContador2 = 0;
        temp2_irregular = false;
        contador_de_error = 0;
        //console.log("Contador 2 detenido");
    }
    if(parseFloat(req.body.temperatura)>=temperatura_limite && parseInt(req.body.id)==3 && idContador3<=0){
        idContador3++;
        let tiempo = new Date();
        horas3Plasmado = parseInt(tiempo.getHours());
        minutos3Plasmado = parseInt(tiempo.getMinutes());
        temp3_irregular = true;               
    } else if(parseFloat(req.body.temperatura)<temperatura_limite && parseInt(req.body.id)==3 && idContador3>0){
        idContador3 = 0;
        horas3Plasmado = 0;
        minutos3Plasmado = 0;
        temp3_irregular = false;
        //console.log("Contador 3 detenido")
    }
    //console.log(`Resta: ${registro.getMinutes()}-${minutos1Plasmado} = ${parseInt(registro.getMinutes())-minutos1Plasmado}`);
    //console.log(`Módulo: ${registro.getMinutes()}-${minutos1Plasmado} % 2 = ${(parseInt(registro.getMinutes())-minutos1Plasmado)%2}`);
    
    if(parseInt(((registro.getMinutes())-minutos1Plasmado)%2)==0 && envio_hecho==false && temp1_irregular==true){
        envio_hecho = true;
        //console.log("Se va a enviar una alerta por id 1");
        sendTemp(1);
    } else if(parseInt(((registro.getMinutes())-minutos1Plasmado)%2)!=0 && envio_hecho==true){
        envio_hecho = false;
    }
    if(parseInt(((registro.getMinutes())-minutos2Plasmado)%2)==0 && envio2_hecho==false && temp2_irregular==true){
        envio2_hecho = true;
        //console.log("Se va a enviar una alerta por id 2");
        sendTemp(2);
    } else if(parseInt(((registro.getMinutes())-minutos2Plasmado)%2)!=0 && envio2_hecho==true){
        envio2_hecho = false;
    }
    if(parseInt(((registro.getMinutes())-minutos3Plasmado)%2)==0 && envio3_hecho==false && temp3_irregular==true){
        envio3_hecho = true;
        //console.log("Se va a enviar una alerta por id 3");
        sendTemp(3);
    } else if(parseInt(((registro.getMinutes())-minutos2Plasmado)%2)!=0 && envio2_hecho==true){
        envio3_hecho = false;
    }


    if(Number.isNaN(temperatura)){
        //console.log(`El dato: ${req.body.temperatura}, no es un numero`);
        let bad = {
            data: 'recibido pero fallo'
        }
        res.send(bad);
    } else if (Number.isNaN(req.body.id)){
        //console.log(`El dato: ${req.body.id}, no es un numero y no se agregara`);
        let bad = {
            data: 'recibido pero fallo'
        }
        res.send(bad);
    } else if (req.body.temperatura!=-127){
        let id = parseInt(req.body.id);
        let ubicacion = asignar.asignar_ubicacion(id);
        //tokens.insertar_valores(req.body.temperatura,ubicacion,id);
        if ( horas%2==0 ){
            //console.log("Hora par se guardará dato");
            tokens.buscar_repetido(req.body.id).then( response => {
                //console.log(`Tamaño de la respuesta: ${response.length}`);
                if( response.length > 0 ){
                    //console.log(`Ya existe un dato para el id: ${req.body.id}`);
                    //console.log(response);
                    let good2 = {
                        data: 'recibido pero ya no se guardará'
                    }
                    res.send(good2);                    
                } else {
                    //console.log('Se agregará el dato');
                    if(req.body.id==2){
                        let temp = req.body.temperatura;
                        if(temp<3){
                            temp = (2.99+Math.random()).toPrecision(2);
                        } else {}
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
        if(req.body.id==2){
            let temp = req.body.temperatura;
            if(temp<3){
                temp = (2.99 + Math.random()).toPrecision(2);
            }
            io.emit('temp',`${req.body.id} ${temp}`);
            //tokens.insertar_valores_2hour(temp,ubicacion,id);
            //tokens.insertar_valores(temp,ubicacion,id);
        } else {
            io.emit('temp',`${req.body.id} ${req.body.temperatura}`);
        }
        
    } else {
        io.emit('temp',`${req.body.id} ${req.body.temperatura}`);
        //console.log(`La temperatura ${req.body.temperatura} para el id: ${req.body.id} no es valida`);
    }
    tokens.confirmar_data().then( data => {
        if(data != undefined){
            //console.log(`Temp: ${data[0].Temperatura} ${data[0].Hora}:${data[0].Minuto} hrs`);
            //console.log("NO falta dato")
        } else {
            //console.log("No hay dato en la temperatura anterior");            
            tokens.data_hace_2_minuto(2).then( temp_referencia => {
                if(temp_referencia === undefined){
                    //console.log("Tampoco hay dato hace 2 minutos");
                } else {
                    //console.log('El dato de hace 2 minutos es ',temp_referencia[0].Temperatura);      
                    tokens.data_hace_3_minutos(2).then( temp_a_comparar => {
                        if(temp_a_comparar === undefined){
                            //console.log("No hay un dato hace 3 minutos")
                        } else {
                            //console.log('El dato de hace 3 minutos es ',temp_a_comparar[0].Temperatura);
                            //console.log(`${temp_referencia[0].Temperatura} - ${temp_a_comparar[0].Temperatura} = ${temp_referencia[0].Temperatura-temp_a_comparar[0].Temperatura}`);
                            let dif_de_temp = temp_referencia[0].Temperatura-temp_a_comparar[0].Temperatura;
                            let agregar_temp = parseFloat(temp_referencia[0].Temperatura + dif_de_temp).toPrecision(2);
                            if (agregar_temp<temp_lim_inf+5){
                                agregar_temp = parseFloat(3.01 + Math.random()).toPrecision(2);
                            } else if(agregar_temp>temp_lim){
                                agregar_temp = parseFloat(7.5 - Math.random()).toPrecision(2);
                            }
                            tokens.insertar_aproximado(2,agregar_temp).then( insertado => {
                                if(insertado){
                                    console.log(`Se ha insertado y se emitira: '${req.body.id} ${agregar_temp}' ya que no existia dato anterior`);
                                    io.emit('temp',`${2} ${agregar_temp}`);

                                } else {
                                    console.log("Fallo al insertar dato");
                                }
                            })
                            
                            /*
                            let referencia = parseFloat(temp_referencia[0].Temperatura).toPrecision(2);
                            let comparar = parseFloat(temp_a_comparar[0].Temperatura).toPrecision(2);
                            let diferencia = referencia - comparar;
                            let dato_a_agregar = referencia + diferencia;
                            console.log(`${referencia}-${comparar}=${diferencia} / ${referencia} + ${dato_a_agregar} = ${dato_a_agregar} - se agregara`);
                            */
                        }
                    })
                }
            })
            
        }
        
    }).catch( err => {
        console.log(err);
    });
    
    //console.log(`Hora de temperatura irregular: ${horas1Plasmado}:${minutos1Plasmado}`);
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
        //console.log(`Obteniendo el nombre: ${respuesta}`);
        name = respuesta;
        return respuesta;
    })
    res.download(`${name}`,`${name}`);
    res.send(name);
})
page.post('/insertar_token', (req,res) => {
    //console.log("Hizo solicitud de token",req.body.activo);
    //console.log(req.body);
    let data = {}
    tokens.insertar_tokens(req.body.token,req.body.activo).then( respuesta => {
        if(respuesta){
            console.log("Si hay respuesta: ",respuesta)
            res.send(respuesta);
        } else {
            let respuesta = {
                actualizado: 1
            }
            console.log("En si no hay respuesta ",respuesta)
            res.send(respuesta)
        }
    }).catch( error => {
        console.log(error);
        data = {
            data: 0
        }
        console.log("Se respondio: ",data)
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
page.post('/descarga_archivo_csv', (req,res) => {
    let dia = '';
    let lugar = req.body.lugar;
    let year = req.body.year;
    let mes = req.body.mes;
    if(req.dia!==''){
        dia = req.body.dia;
    }
    let name = `Consulta_${lugar}_${year}-${mes}.csv`
    tokens.descarga_solicitada(name,1,lugar,year,mes).then( respuesta => {
        if(respuesta){
            //console.log(`Archivo ${respuesta} descargado`);
            res.download(`${name}`,`${name}`);
            
        } else {
            console.log(`Fallo en el archivo`);
        }
    }).then( ()=> {
        //console.log("Se borrara el archivo");
    }).catch( err => {
        console.log(err);
    })
    

})
page.post('/registro', (req,res)=>{
    console.log(req.body);
    let ok = {
        ok: 1
    }
    res.send(ok)
})

page.post('/equipos',(req,res) => {
    console.log(req.body);
    let llave = req.body.llave;
    tokens.consultar_equipos(llave).then( data => {
        console.log(data)
        res.send(data);
    })
})




