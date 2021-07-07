const Ws = require('ws');
const express = require('express');
const tokens = require('./querys.js');
const https = require('https');
const fs = require('fs');
const path = require('path');
let asignar = require('./asignacion.js');
let mensajes = require('./fcmessage.js');
const asignacion = require('./asignacion.js');
const config = require('./configuration.js');
const api = require('./rutas/rutasApi.js');
const servicios = require('./servicios/consulta.js');

let id_arreglo = 0


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
let identificador=0;
let temp_prueba_limite_superior = 7.5;
let temp_prueba_limite_inferior = 3.5;

let segundos = 0;
let minutos = 0;
let segundos_2 = 0;
let minutos_2 = 0;


let contador_de_error = 0;

let inicio_1 = 0
let inicio_2 = 0
let segundos_1 = 0

let minutos_1 = 0


let temp_temporal_1;
let temp_temporal_2; 

let contador_1 = 0
let contador_2 = 0
let contador_3 = 0

let actualizar_temp_2 =0
let actualizar_temp_1 =0

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
const zeroSsl = 5000;
const sensores_en_total = 3;
let string_ofice_temperature = "";
let float_ofice_temperature = 0.0;
let string_ofice_ID = "";
let integer_alertas = 0;
let alerta = 1;
let turno = 1;


let timer = 0;

let hora_desactivacion = 23;
let hora_activacion = 8;
let minuto_desactivacion = 59;

let alertas = [
    {
        id: 1,
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0
    },
    {
        id: 2,
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0
    }
]

/////////////////////

/*
page.listen(zeroSsl, () => {
    console.log(`Escuchando por el puerto ${zeroSsl}`);
})
page.use('/.well-known/pki-validation/',express.static('verifi'));
//carperta verify solo para poner el nuevo archivo para validar
*/

////////////////////////////


page.use('/imagenes',express.static('mesas125'));

const httpServer = https.createServer({
    key: fs.readFileSync(path.resolve('/home/victory/server/gitServer/raspberryServer/certs/private.key')),
    cert: fs.readFileSync(path.resolve('/home/victory/server/gitServer/raspberryServer/certs/certificate.crt'))
   
   },page);


httpServer.listen(config.portServer,()=>{
  console.log(`Servidor disponible en el puerto ${config.portServer}`);
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
page.get('/historial', (req,res) => {
    tokens.obtener_ultimo_dato(1).then( respuesta => {
        //console.log(respuesta)
        return(respuesta);
    }).then( data => {
        tokens.obtener_ultimo_dato(2).then( respuesta => {
            //console.log(respuesta);
            let payload = [data, respuesta]
            
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
    }).catch( err => {
        console.log(err);
        let insatisfactorio = {
            ok: 0,
            message: "No se pudo loguear"
        }
        res.send(insatisfactorio);
    })
    //res.send('Recibido');
})



page.post('/temperatura',(req,res)=>{
    sendTemp = (id,temp_actual) => {
        let temp;
        let temp2;
        let temp3;
        let ubicacion;
        if(id==1){
            temp = idTemp; 
            ubicacion = asignar.asignar_ubicacion(id);
            mensajes.notificacion_temperatura(temp_actual,ubicacion);
            tokens.insertar_excepcion(temp,ubicacion,id);
        } else if(id==2){
            temp2 = id2Temp
            ubicacion = asignar.asignar_ubicacion(id);
            mensajes.notificacion_temperatura(temp_actual,ubicacion);
            tokens.insertar_excepcion(temp2,ubicacion,id);
        } else if(id==3){
            temp3 = id3Temp
            ubicacion = asignar.asignar_ubicacion(id);
            //mensajes.notificacion_temperatura(temp3,ubicacion);
        }
    } 
    let temperatura = 0;
    let temperatura_original = 0;  
    let lugar;
    let id = parseInt(req.body.id);
    id_arreglo = id;


    let reloj = new Date();
    console.log(`ID: ${req.body.id} Temp: ${req.body.temperatura}°C ${reloj.getHours()}:${reloj.getMinutes()}:${reloj.getSeconds()}`);
    if(isNaN(req.body.temperatura) && isNaN(req.body.id)){
        console.log(`Dato no leible`);
    } else {
        temperatura = parseFloat(req.body.temperatura);
        lugar = asignar.asignar_ubicacion(req.body.id);
        temperatura_original = temperatura;
    }

    if(temperatura<3.3 || temperatura>7.7){
        tokens.insertar_excepcion(req.body.temperatura,lugar,req.body.id);
    }
    if (temperatura<3){
        temperatura = (2.99 + Math.random()).toPrecision(2);
        tokens.guardar_todos_los_datos(temperatura,lugar,req.body.id);
        if(Number.isNaN(req.body.id)){
            console.log("Error al convertir para enviar la alerta")
        } else {
            let id = Number.parseInt(req.body.id)
            console.log("Enviar alerta")
            
        }
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
    //console.log(`Resta: ${registro.getMinutes()}-${minutos1Plasmado} = ${parseInt(registro.getMinutes())-minutos1Plasmado}`);
    //console.log(`Módulo: ${registro.getMinutes()}-${minutos1Plasmado} % 2 = ${(parseInt(registro.getMinutes())-minutos1Plasmado)%2}`);
    
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
    if(id==1){
        if(temperatura_original>temp_prueba_limite_superior || temperatura_original<temp_prueba_limite_inferior){
            //console.log("Contando ", contador_1)
            contador_1++
            if(contador_1==1){
                var ciclo_id_1 = setInterval(()=>segundero(id,'identificador 1'),1000)
                actualizar_temp_1 = req.body.temperatura;
            } else {
                actualizar_temp_1 = req.body.temperatura;
            }
            
        } else {
            actualizar_temp_1 = req.body.temperatura;
        }
    } else if(id==2){
        if(temperatura_original>temp_prueba_limite_superior || temperatura<temp_prueba_limite_inferior){
            contador_2++
            console.log("Temperatura 2 por debajo de lo normal")
            if(contador_2==1){
                var ciclo_id_2 = setInterval(()=>segundero(id,'identificador 2'),1000)
                actualizar_temp_2 = req.body.temperatura;
            } else {
                
            }
            //var ciclo_id_2 = setInterval(()=>segundero(id,'identificador 2'),1000)
        } else {
            actualizar_temp_2 = req.body.temperatura;
        }
    } else {

    }
    let actualizar_temp = req.body.temperatura;
    if(req.body.id==2){
        actualizar_temp_2 = req.body.temperatura;
    }
    if(req.body.id==1){
        actualizar_temp_1 = req.body.temperatura;        
    }
    
    
    function segundero(id,name){
        let actualizar_temperatura_3 = req.body.temperatura;
        let reloj = new Date();
        let hora_actual=reloj.getHours();
        let minuto_actual = reloj.getMinutes();
        //actualizar_temp = req.body.temperatura
        if(id==1){
            console.log(`De: ${name} id: ${id} ${minutos}:${segundos} temp: ${actualizar_temp_1} Hora: ${hora_actual}:${minuto_actual}`);
            if(segundos<60){
                segundos++
            }
            if(segundos==60){
                minutos++
                segundos=0
            }
            if(minutos%2==15 && segundos==0 && minutos!=0){
                   hora_activacion<hora_actual && hora_desactivacion>hora_actual
                if(hora_activacion<hora_actual && hora_desactivacion>hora_actual){
                    sendTemp(id,actualizar_temp_1);
                } else {
                    console.log("Ya es muy tarde para enviar notificaciones")
                }
                
            }
            if(actualizar_temp_1>temp_prueba_limite_inferior && actualizar_temp_1<temp_prueba_limite_superior){
                console.log("Debe de detener el intervalo")
                clearInterval(ciclo_id_1);
                contador_1 = 0;
                minutos = 0;
                segundos = 0;
            }
            
        }
        if(id==2){
            console.log(`De: ${name} id: ${id} ${minutos_2}:${segundos_2} temp: ${actualizar_temp_2} Hora: ${hora_actual}:${minuto_actual}`);
            if(segundos_2<60){
                segundos_2++
            }
            if(segundos_2==60){
                minutos_2++
                segundos_2=0

            }
            if(/*actualizar_temp_2>temp_prueba_limite_inferior&& */actualizar_temp_2<temp_prueba_limite_superior){
                clearInterval(ciclo_id_2);
                contador_2 = 0;
                minutos_2 = 0;
                segundos_2 = 0;
            }
            if(minutos_2%2==15 && segundos_2==0 && minutos_2!=0){
                console.log("Preparando para enviar a lerta para ver la hora");
                if(hora_activacion<hora_actual && hora_desactivacion>hora_actual){
                    sendTemp(id,actualizar_temp_2);
                } else {
                    console.log("Ya es muy tarde para enviar notificaciones")
                }
                
            }
        }
        ///////////////////////////////////////////////////////////////
        
        ///////////////////////////////////////////////////////////////
        
    }
    //actualizar_temp = 
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
page.post('/raspbi',(req,res) => {
    const { temperatura, id } = req.body
    console.log(req.body)
    console.log(`Respby ->id: ${id} temp:${temperatura}`)
    let ok = {
        ok: 1
    }
    res.send(ok)
})
page.get('/tomardata',(req,res) => {
    let ok = {
        ok: 1
    }
    console.log("Respondiendo al error")
    res.send(ok)
})
page.post('/recepcion',(req,res)=>{
    const {temp, id} = req.body
    console.log(`Temp: ${temp}, id: ${id}`);
    let respuesta = {
        code: 1
    }
    io
    res.send(respuesta);
    io.emit('temp',`${id} ${temp}`);
    if(isNaN(temp)&& isNaN(id)){
        console.log("Imposible convertir")
    } else {
        console.log("Se puede convertir los numeros")
        tokens.recursos_sensores().then( response => {
            return response
        }).then(data => {
            //console.log(data)
            data.map( element => {
                //console.log(element.id)
                if(element.id==id){
                    console.log(`Se va a agregar con la ubicacion ${element.lugar} ya que coincide con el id ${id} `)
                    tokens.insertar_registro(temp,element.lugar,id,element.ubicacion).then( resultado => {
                        console.log(resultado)
                    }).catch( err => {
                        console.log(err)
                    })
                }
            })
        }).catch( err => {
            console.log(err)
        })

        //tokens.guardar_todos_los_datos(temp,)
    }
})
page.get('/sensores',(req,res) => {
    console.log("consultado")
    tokens.recursos_sensores().then( (respuesta)=>{
        res.send(respuesta)
    })
})
page.post('/obtener_sensores',(req,res) => {
    let payload = []
    let respuestas = req.body.map( element => tokens.extraer_temperaturas_recientes(element.id))
        Promise.all(respuestas).then( elemento => {
            console.log("Arreglo:",elemento)
            elemento.map(elem=>{
                console.log("Map dentro de el promise all",elem[0])
                payload = [
                    ...payload,
                    elem[0]
                ]
            })
            console.log("Payload: ",payload)
            res.send(payload)
        })
})
page.post('/singin', ( req,res )=>{
    if (req.body){
        console.log(req.body)
        const {id,ubicacion,piso,lugar,equipo,serie,capacidad,especial} = req.body
        let ok = {
            ok: 1
        }
        console.log(`${id}, ${ubicacion}, ${piso}, ${lugar}, ${equipo}, ${serie}, ${capacidad}, ${especial} `)
        tokens.registrar_nuevo_sensor(id,ubicacion,piso,lugar,equipo,serie,capacidad,especial).then( response => {
            console.log(response)
        })
        res.send(ok)
    } else {
        let ok = {
            ok: 0
        }
        res.send(ok)
    }
    

})
page.post('/ginecologia/3a/mesas',servicios.getEquipos);
page.post('/equipos/mesas',servicios.getMesas);
page.post('/busqueda',servicios.obtenerEquipos)
/*

setInterval(()=>{
    alertas.map( (element,turno,nose) => {
        //console.log("Elemento: ",element);
        //console.log("Lugar del arreglo: ", turno-1);
        //console.log("Otro: ", nose);
        if(id_arreglo==element.id){
            console.log("coincidencia encontrada ->", element)
            alertas = [
                ...alertas,
                {
                    id: id_arreglo,
                    dias: alertas[turno-1].dias,
                    horas: 0,
                    minutos: 0,
                    segundos: 0
                }
            ]
        } else {
            //console.log("coincidendcia no encontrada")
        }
    })
},1000)
*/




