const mySql = require ('mysql');
const fs = require('fs');
const { resolve, parse } = require('path');
const { rejects } = require('assert');
const { response } = require('express');
const base_de_datos = mySql.createConnection({
    host: 'localhost',
    user: 'infoUpdater',
    password: 'Ko-107005205-ko',
    
})
const data_base = 'monitoreo';
const tabla_de_datos = 'Bitacora';
const tabla_daly = 'dalyData';
const tabla_test = 'test';
const tabla_de_temperaturas = 'dalyData';
const tabla_de_tokens = 'mensajeria';
const tabla_de_excepciones = 'exception'
const tabla_de_usuarios = 'usuarios';
const tabla_de_equipos = 'equipos';
const tabla_de_recursos = 'relacion';
const tabla_de_camas = 'camas';
let tokens = [];
const id_length = 3;

module.exports = {
    asignar_tokens: () => {
        base_de_datos.query("SELECT * FROM tokens.Tokens", (err, token, campos)=>{
            if(err){
                console.log(err);
            }
            for (let contador = 0; contador<token.length; contador++){
                tokens[contador] = token[contador].token;
            }
            return tokens;
        })
        return tokens;
    },insertar_tokens: (token,activo) => {
        return new Promise( (resolve,reject) => {
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_tokens} WHERE token="${token}"`, (err,result,otro) => {
                if(err){
                    console.log(err)
                    reject()
                } else {
                    if(result){
                        console.log("Resultado: ",result);
                        if(result.length>0){
                            console.log("Resultado mayor a 0");
                            //console.log("El token ya existe");
                            //console.log(typeof(activo));
                            if(activo==2){
                                //console.log("Token consultado: ",result)
                                resolve(result);
                                
                            } else {
                                base_de_datos.query(`UPDATE ${data_base}.${tabla_de_tokens} SET activo=${activo} WHERE token="${token}";`, err => {
                                    if(err){
                                        let payload = {
                                            actualizado: false
                                        }
                                        console.log(err);
                                        resolve(payload); //en caso de no poder actualizar
                                    } else {
                                        let payload = {
                                            actualizado: true 
                                        }
                                        //console.log("Token actualizado");
                                        resolve(payload); //en caso de poder actualizar
                                    }
                                })
                            }
                        } else {
                            if(activo==2){
                                activo=1
                            }
                            base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_tokens} (token,activo) VALUES ("${token}",${activo})`, err => {
                                if(err){
                                    console.log(err);
                                    reject();
                                }
                                console.log("Token insertado");
                                let data={
                                    insertado: 1
                                }
                                resolve(data);
                            })
                        }
                    } else {
                        console.log("No hay respuesta");
                    }
                }
                
            })
        })
    },
    solicitar_tokens: () => {
        return new Promise( (resolve,reject) => {
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_tokens} WHERE activo=1;`,(err,data,otro) => {
                if(err){
                    console.log(err);
                    reject();
                } else {
                    //console.log("Datos: ")
                    //console.log(data);
                    resolve(data);
                }
            })
        })
         
    },
    insertar_valores_2hour: (temperatura, lugar,ID) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth() + 1;
        base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_temperaturas}(Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${temperatura}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${tiempo.getHours()},${tiempo.getMinutes()},${tiempo.getSeconds()},${ID},'H. Cardiología S. XXI');`,(err,values,data) => {
            if(err){
                console.log(err);
            }
        });
    },
    insertar_excepcion: (temperatura,lugar, ID) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth() + 1;
        base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_excepciones} (Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${temperatura}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${tiempo.getHours()},${tiempo.getMinutes()},${tiempo.getSeconds()},${ID},'H. Cardiología S. XXI');`,(err,values,data) => {
            if(err){
                console.log(err)
            }
        })
    },
    insertar_valores: (temperatura, lugar,ID) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth()+1;
        base_de_datos.query(`INSERT INTO monitoreo.Bitacora(Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${temperatura}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${tiempo.getHours()},${tiempo.getMinutes()},${tiempo.getSeconds()},${ID},'H. Cardiología S. XXI');`,(err,values,data)=>{
            if(err){
                console.log(err);
            }
        })
    },
    consultar_base: () => {
        base_de_datos.query(`SELECT * FROM  monitoreo.Bitacora`,(err,datos,campos)=>{
            if(err){
                console.log(err);
            }
            //console.log("khe");
            //console.log(datos);
            //console.log(campos);
        })
    }
    ,
    extraer_años: (ubicacion) => {
        let elementos = [];
        //console.log("Ubicacion en la base: ",ubicacion);
        //console.log("Buscando años");
        return new Promise( (resolve,reject) => {
            //let elementos = [];
            base_de_datos.query(`SELECT DISTINCT Año FROM ${data_base}.${tabla_de_temperaturas} WHERE Lugar='${ubicacion}';`,(err,data,campos)=>{
                if (err){
                    reject(new Error());
                    console.log(err);
                } else {
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].Año;
                    }
                    //console.log(elementos);
                    resolve(elementos);
                    //console.log("Años enviados");
                }
            })
        })
    },extraer_dias: (mes,year,lugar) => {
        //console.log("consultando los dias");
        let meSiguiente = parseInt(mes)+1;
        let dia_primero = 1;
        let dia_final = 1;
        
        if (mes==12){
            dia_final = 31;
            meSiguiente = 12;
        }

        return new Promise( (resolve,reject) => {
            let elementos = [];
            base_de_datos.query(`SELECT DISTINCT Dia AS dia FROM ${data_base}.${tabla_de_temperaturas} WHERE Año=${year} AND Lugar='${lugar}' AND Mes=${mes} ORDER BY dia;`, (err,data,otro) => {
                if (err){
                    reject(new Error());
                    console.log(err);
                } else {
                    for(let i=0;i<data.length;i++){
                        elementos[i] = data[i].dia;
                    }
                    //console.log(elementos);
                    resolve(elementos);
                }
            })
        })

    },
    extraer_datos:()=>{
        return new Promise((resolve,reject)=>{
            let elementos =[];
            base_de_datos.query(`SELECT DISTINCT (extract(year FROM fecha)) AS año FROM monitoreo.Registro;`,(err,data,filas)=>{
                if(err){
                    reject (new Error());
                }
                
                else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].año;
                    }
                    
                    resolve(elementos);
                }
                //console.log(elementos);
            })
        })
    },
    extraer_mes: (year) => {
        return new Promise((resolve,reject)=>{
            let elementos =[];
            base_de_datos.query(`SELECT DISTINCT Mes AS mes FROM ${data_base}.${tabla_de_temperaturas} WHERE Año=${year};`,(err,data,filas)=>{
                if(err){
                    reject (new Error());
                }
                else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].mes;
                    }
                    
                    resolve(elementos);
                }
                //console.log(elementos);
            })
            
        })        
    },
    extraer_dia: (year,mes) => {
        //console.log("Consultando los dias");

        let meSiguiente = parseInt(mes)+1;
        let dia_primero = 1;
        let dia_final = 1;
        if(mes==12){
            meSiguiente = 12;
            dia_final = 31;
        }
        return new Promise((resolve,reject)=>{
            let elementos = [];
            base_de_datos.query(`SELECT DISTINCT (extract(day FROM fecha)) AS dia FROM monitoreo.Registro WHERE fecha>= '${year}-${mes}-${dia_primero}' AND fecha<'${year}-${meSiguiente}-${dia_final}';`,(err,data,otro)=>{
                if(err){
                    reject(new Error()); 
                    console.log(err);
                } else {
                    for(let i=0;i<data.length;i++){
                        elementos[i] = data[i].dia;
                    }
                    //console.log(elementos);
                    resolve(elementos);
                }
                //console.log(elementos);
            });
        })
    }, extraer_ubicaciones: () => {
        return new Promise( (res, rej) => {
            let payload;
            base_de_datos.query(`SELECT DISTINCT Lugar AS lugar, Ubicacion FROM ${data_base}.${tabla_daly};`,(err,data,otro)=>{
                if (err){
                    console.log(err)
                    rej(new Error);
                } else {
                    res(data);
                }
            })
            
        })
    },
    extraer_ubicacion: () => {
        return new Promise((resolve,reject)=>{
            let elementos = [];
            /*
            base_de_datos.query(`SELECT DISTINCT ubicacion AS lugar FROM monitoreo.Registro;`,(err,data,otro)=>{
                if(err){
                    reject(new Error());
                }else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].lugar;
                    }
                    
                    resolve(elementos);
                }
                console.log(elementos);
            })*/
            base_de_datos.query(`SELECT DISTINCT Lugar AS lugar, Ubicacion FROM ${data_base}.${tabla_daly};`,(err,data,otro)=>{
                if(err){
                    reject(new Error());
                }else{
                    //console.log(data);
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].lugar;
                    }
                    
                    resolve(elementos);
                }
                let experimento = data;
                //console.log(elementos);
                //console.log(experimento);
            })
        })
    },obtener_nombre:(ubication,year,mes,dia)=>{
        return new Promise((resolve,reject)=>{
            if(dia==''){
                if(ubication.length<0 || year<0 || mes < 0){
                    reject( ()=>{console.log("Error al crear nombre: Con mes")})
                } else {
                    let name = `Consulta ${ubication} ${year}-${mes}.csv`
                    resolve(name)
                }
            } else {            
                if(ubication.length<0||year<0||mes<0||dia<0){
                    reject(()=>{
                        console.log("Error al crear nombre con dia");
                    })
                } else {
                    let name = `Consulta_${ubication}_${year}-${mes}-${dia}.csv`;
                    resolve(name);
                }
                
            }
        })
    },
    consulta_por_mes: (year,lugar,mes,name) => {
        return new Promise( (resolve,reject) => {
            fs.appendFile(`${name}`,`Consulta de ${lugar} del mes/año ${mes}/${year}\nLugar;Temperatura °C;Dia;Mes;Hora\n`, err => {
                if(err){
                    console.log(err)
                    reject(err);
                }
            })
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_temperaturas} WHERE Lugar='${lugar}' AND Año=${year} AND Mes=${mes} ORDER BY Dia,Hora;`,(err, data, otro) => {
                if(err){
                    console.log(err);
                    reject(err);
                } else {
                    //console.log(data);
                    data.forEach( (element,id) => {
                        fs.appendFile(`${name}`,`${element.Lugar};${element.Temperatura};${element.Dia};${element.Mes};${element.Hora}\n`, err => {
                            if(err){
                                console.log(err);
                                reject(err);
                            }
                        })
                    })
                    resolve(data);
                }
            })
        })        
    },
    descarga_solicitada: (name,tipo_de_consulta,lugar,year,mes) => {
        if(tipo_de_consulta==1){
            return new Promise( (resolve,reject) => {
                fs.appendFile(`${name}`,`Consulta de ${lugar} del mes/año ${mes}/${year}\nLugar;Temperatura °C;Dia;Mes;Hora\n`, err => {
                    if(err){
                        console.log(err)
                        reject(err);
                    }
                })
                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_temperaturas} WHERE Lugar='${lugar}' AND Año=${year} AND Mes=${mes};`, (err,data,otro) =>{
                    if(err){
                        console.log(err);
                        reject(err);                        
                    } else {
                        data.forEach( (element,id) => {
                            fs.appendFile(`${name}`,`${element.Lugar};${element.Temperatura};${element.Dia};${element.Mes};${element.Hora}\n`, err => {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                }
                            })
                        })    
                        resolve(name);
                    }
                } )
            })
        } else if (tipo_de_consulta==2){
            //console.log("Consulta por dias");
        }
        
    },
    consultar_base_de_datos: (ubication,year,mes,dia,name,descarga_solicitada) => {
        //console.log(`Obteniendo el nombre para la consulta: ${name}`);
        //console.log(`Lugar: ${ubication} ${dia}/${mes}/${year}, Hora: ${hora_inicial}:${minuto_inicial} - ${hora_final}:${minuto_final}`)
        return new Promise( (resolve,reject) => {
            let elementos = [];
            //let name = `Consulta_${ubication}_${year}-${mes}-${dia}.csv`
            //console.log(`SELECT Lugar AS ubicacion,Temperatura AS temperatura, Dia,Mes,Año,Hora,Minuto,Segundo FROM ${data_base}.${tabla_de_temperaturas} WHERE Lugar='${ubication}' AND Dia=${dia} AND Mes=${mes} AND Hora>=0 AND Hora<=24 AND Año=${year} ;`)
            fs.appendFile(`${name}`,`Consulta de ${ubication} con fecha de ${dia}/${mes}/${year}\nLugar;Temperatura °C;Hora\n`,function(err){
                if(err){
                    throw err;
                }
                //console.log('Guardado');
            })
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_temperaturas} WHERE Lugar='${ubication}' AND Dia=${dia} AND Mes=${mes} AND Hora>=0 AND Hora<=24 AND Año=${year} ORDER BY Hora;`,(err,data,otro)=>{
                if(err){
                    console.log(err);
                    reject(new Error());
                } else {
                    //console.log(`Creando la cabecera del archivo: ${name}`)
                    
                    //console.log(`Para cada elemento en el archivo: ${name}`)
                    
                    data.forEach((element,id) => {  
                        fs.appendFile(`${name}`,`${element.Lugar};${element.Temperatura};${element.Hora}\n`, err => {
                            if(err){
                                console.log(err);
                                reject(err);
                            }
                        })
                        //console.log(`${element.ubicacion} ${element.temperatura} ${element.fecha}`)
                        //console.log(elementos[i]);
                    });
                    
                    //console.log(elementos);
                    //console.log("Archivo creado y actualizado");
                    if(descarga_solicitada==1){

                    }
                    resolve(data);
                    
                    
                }
            })
        })
    },
    leer_error: (error) => {
        console.log(error);
    },
    buscar_repetido: (id_turno) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth()+1;
        return new Promise((resolve,reject)=>{
            base_de_datos.query(`SELECT * FROM monitoreo.${tabla_daly} WHERE ID=${id_turno} AND Año=${tiempo.getFullYear()} AND Mes=${mes} AND Dia=${tiempo.getDate()} AND Hora=${tiempo.getHours()} AND Minuto<=${tiempo.getMinutes()}`,(err,data,otro)=>{
                if(err){
                    console.log(err);
                    reject(new Error());
                }
                else{
                    //console.log(data);
                    resolve(data);
                }
    
            })

        })
        
    },agregar_aproximado: (id,temp_Limt_inf,temp_lim_sup) => {
        let tiempo = new Date();
        let mes= tiempo.getMonth()+1;
        let minuto;
        let hora;
        let minutoBusqueda;
        let minutoBusqueda2;
        const limite_inferior = 2.89;
        const limite_superior = 7.88;
        return new Promise( (resolve,reject) => {
            if(parseInt(tiempo.getMinutes())==0){
                hora = parseInt(tiempo.getHours()) - 1;
                minuto = 59;
                minutoBusqueda = minuto - 1;
                minutoBusqueda2 = minutoBusqueda - 1;
            } else {
                minuto = parseInt(tiempo.getMinutes()) - 1;
                minutoBusqueda = minuto - 1;
                minutoBusqueda2 = minutoBusqueda - 1;
                hora = parseInt(tiempo.getHours());
            }
            //console.log(`Hora: ${hora}`);
            base_de_datos.query(
                `SELECT Temperatura, Hora, Minuto FROM ${data_base}.${tabla_de_datos} WHERE id=${id} AND Dia=${tiempo.getDate()} AND Mes=${mes} AND Año=${tiempo.getFullYear()} AND Hora=${hora} AND Minuto=${minuto} ORDER BY turno LIMIT 1;`
                ,(err,data,otro)=>{
                    if(err){
                        console.log(err);
                        reject(err);
                    } else {
                        if(data.length>0){
                            //console.log(`${data[0].Temperatura}°C ${data[0].Hora}:${data[0].Minuto}`);
                        } else {
                            //console.log("No hay resultado, se comparara con el inmediato anterior y el anterior al inmediato");
                            base_de_datos.query(
                                `SELECT Temperatura, Hora, Minuto FROM ${data_base}.${tabla_de_datos} WHERE id=${id} AND Dia=${tiempo.getDate()} AND Mes=${mes} AND Año=${tiempo.getFullYear()} AND Hora=${hora} AND Minuto=${minutoBusqueda} ORDER BY turno LIMIT 1;`
                                , (err,info,otro)=>{
                                if (err){
                                     console.log(err)
                                     reject(err);
                                } else {
                                    if(info.length>0){
                                        //console.log(`Temperatura más proxima: ${info[0].Temperatura}`);
                                        base_de_datos.query(
                                            `SELECT Temperatura, Hora, Minuto FROM ${data_base}.${tabla_de_datos} WHERE id=${id} AND Dia=${tiempo.getDate()} AND Mes=${mes} AND Año=${tiempo.getFullYear()} AND Hora=${hora} AND Minuto=${minutoBusqueda2} ORDER BY turno LIMIT 1;`
                                            ,(err,resultado,otro) => {
                                            if(err){
                                                console.log(err)
                                                reject(err);
                                            } else {
                                                if(resultado.length>0){
                                                    let lugar = "Cámara farmacia"
                                                    let tempProxima = parseFloat(info[0].Temperatura);
                                                    let tempProxima2 = parseFloat(resultado[0].Temperatura);
                                                    //console.log(`Temperatura a restar: ${resultado[0].Temperatura}`)
                                                    //console.log(`${info[0].Temperatura} - ${resultado[0].Temperatura} = ${ (tempProxima+tempProxima2).toPrecision(2) }`);
                                                    //console.log(`INSERT INTO monitoreo.Bitacora (data,hora,minuto) VALUES (${(tempProxima+tempProxima2).toPrecision(2)},${hora}, ${minutoBusqueda})`)
                                                    //let aproxTemp = (parseFloat(info[0].Temperatura) - parseFloat(resultado[0].Temperatura)).toPrecision(2)
                                                    let aproxTemp = parseFloat(tempProxima - tempProxima2).toPrecision(2);
                                                    console.log(`${tempProxima} - ${tempProxima2} = ${aproxTemp}`)
                                                    if( Number.isNaN(aproxTemp)){
                                                        console.log("No se puede agregar el numero");
                                                    } else {
                                                        let dataAgregar = parseFloat(tempProxima + aproxTemp).toPrecision(3);

                                                        if(Number.isNaN(dataAgregar)){
                                                            console.log("El resultado no se agregara ya que no es un numero");
                                                        } else {
                                                            if(dataAgregar<limite_inferior){
                                                                base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_datos} (Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${limite_inferior},${tiempo.getDate()},${mes},${tiempo.getFullYear()},${hora},${minuto},${60},${id},'H. Cardiología S. XXI');`,(err,mas,otro)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                        reject(err);
                                                                    } else {
                                                                        //console.log("Guardado con exito")
                                                                    }
                                                                })
                                                            } else if (dataAgregar>limite_superior){
                                                                base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_datos} (Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${limite_superior}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${hora},${minuto},${60},${id},'H. Cardiología S. XXI');`,(err,mas,otro)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                        reject(err);
                                                                    } else {
                                                                        //console.log("Guardado con exito")
                                                                    }
                                                                })

                                                            } else {
                                                                base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_datos} (Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${dataAgregar}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${hora},${minuto},${60},${id},'H. Cardiología S. XXI');`,(err,mas,otro)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                        reject(err);
                                                                    } else {
                                                                        //console.log("Guardado con exito")
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    }
                                                    //base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_datos}`)
                                                } else {
                                                    console.log("Wait")
                                                }   
                                            }
                                        })
                                    } else {
                                        
                                        console.log("Sin resultado anterior")
                                    }
                                }
                            })
                        }
                        
                    }
                    
            })
        })
    },obtener_ultimo_dato: (id) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth()+1;
        return new Promise( (res,rej) => {
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_datos} WHERE ID=${id} ORDER BY turno DESC LIMIT 1;`, (err,data,otro)=>{
                if(err){
                    console.log(err);
                    rej();
                } else {
                    //console.log("Data Solicitada: ");
                    //console.log(data)
                    res(data);
                }
            })
        })
    },
    guardar_todos_los_datos: (temperatura, lugar,ID) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth() + 1;
        return new Promise( (resolve,reject) => {
            base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_datos} (Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${temperatura}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${tiempo.getHours()},${tiempo.getMinutes()},${tiempo.getSeconds()},${ID},'H. Cardiología S. XXI');`), (err,info,otro) =>{
                //console.log("Terminada la busqueda");
                if(err){
                    console.log(err);
                    reject(new Error());
                } else {
                    //console.log("Dato emitido: ");
                    //console.log(info);
                    resolve(info);
                }
            }
        })
    },
    validar_login: (user,pass) =>{
        return new Promise((resolve,reject)=>{
            try{
                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_test} WHERE data1='${user}';`,(err,data,otro)=>{
                    if(err){
                        console.log(err);
                        reject(new Error());
                    } else{
                        if (data.length>0){
                             //console.log(data[0].data1==user);
                             //console.log(`${user}`);
                             //console.log(data[0].data2==pass);
                             //console.log(`${pass}`);
                             if(data[0].data1==`${user}` && data[0].data2==`${pass}`){
                                 //console.log("Se encontro coincidencia")
                               //console.log(data.data1);
                               //console.log(data.data2);
                                 let success = {
                                     data: 1,
                                     level: data[0].Level,
                                     id: data[0].id,
                                     unidad: data[0].codigo_unidad
                                 }
                                 console.log(success)
                                 resolve(success);
                           } else {
                               if(data[0].data1!=user){
                                   //console.log("No coincide el nombre de usuario");
                               } else if (data[0].data2!=pass){
                                   //console.log("No coincide la contraseña");
                               } else {
                                   //console.log("No hubo algún tipo de coincidencia");
                               }
                               let unsuccessfully = {
                                   data: 0
                               }
                               resolve(unsuccessfully);
                           }
                        } else {
                            //console.log("No hubo coincidencia");
                            //console.log(data.data1);
                            //console.log(data.data2);
                            let unsuccessfully = {
                                data: 0
                            }
                            resolve(unsuccessfully);
                        }
                    }
                });
            } catch (error){
                console.log(error);                
            }
            
        })
    },
    emitir_datos: () => {
        return new Promise( (resolve, reject) => {
            base_de_datos.query(`SELECT * FROM  ${data_base}.${tabla_de_datos} WHERE ID=1`,(err,datos,campos)=>{
                if(err){
                    console.log(err);
                    reject(new Error());
                }
                else {
                    //console.log(datos.length);
                    //console.log(`${datos[datos.length-1].Lugar}`);
                    //console.log(datos[datos.length-1].Temperatura);
                    //console.log(datos[datos.length-1].Año);
                    //console.log(datos[datos.length-1].Dia);
                    // console.log(datos[datos.length-1].Mes);
                    // console.log(datos[datos.length-1].Hora);
                    // console.log(datos[datos.length-1].Minuto);
                    // console.log(datos[datos.length-1].ID);
                    resolve(datos[datos.length-1]);
                }
            })
        })
    },descargar_consulta: (ubication,year,mes,dia,name,descarga_solicitada) => {
        //console.log(`Obteniendo el nombre para la consulta: ${name}`);
        //console.log(`Lugar: ${ubication} ${dia}/${mes}/${year}, Hora: ${hora_inicial}:${minuto_inicial} - ${hora_final}:${minuto_final}`)
        return new Promise( (resolve,reject) => {
            let elementos = [];
            //let name = `Consulta_${ubication}_${year}-${mes}-${dia}.csv`
            //console.log(`SELECT Lugar AS ubicacion,Temperatura AS temperatura, Dia,Mes,Año,Hora,Minuto,Segundo FROM ${data_base}.${tabla_de_temperaturas} WHERE Lugar='${ubication}' AND Dia=${dia} AND Mes=${mes} AND Hora>=0 AND Hora<=24 AND Año=${year} ;`)
            base_de_datos.query(`SELECT Lugar AS ubicacion,Temperatura AS temperatura, Dia,Mes,Año,Hora,Minuto,Segundo FROM ${data_base}.${tabla_de_temperaturas} WHERE Lugar='${ubication}' AND Dia=${dia} AND Mes=${mes} AND Hora>=0 AND Hora<=24 AND Año=${year} ;`,(err,data,otro)=>{
                if(err){
                    console.log(err);
                    reject(new Error());
                } else {
                    //console.log(`Creando la cabecera del archivo: ${name}`)
                    fs.appendFile(`${name}`,`Consulta de ${ubication} con fecha de ${dia}/${mes}/${year}\nLugar;Temperatura °C;Hora\n`,function(err){
                        if(err){
                            throw err;
                        }
                        //console.log('Guardado');

                    })
                    //console.log(`Para cada elemento en el archivo: ${name}`)
                    data.forEach((element,i) => {  
                        //console.log(`${element.ubicacion} ${element.temperatura} ${element.fecha}`)                  
                        fs.appendFile(`${name}`,`${element.ubicacion};${element.temperatura};${element.Hora}\n`,function(err){
                            if(err){
                                throw err;
                            }
                            //console.log('Guardado');
    
                        })
                        elementos[i]={
                            ubicacion: element.ubicacion,
                            temperatura: element.temperatura,
                            dia: element.Dia,
                            mes: element.Mes,
                            año: element.Año,
                            hora: element.Hora,
                            minuto: element.Minuto,
                            segundo: element.Segundo
                        }
                        //console.log(elementos[i]);
                    });
                    //console.log(elementos);
                    //console.log("Archivo creado y actualizado");
                    if(descarga_solicitada==1){

                    }
                    resolve(elementos);
                }
            })
        })
    },
    borrar_data: () => {
        const inicio_de_mes = 1;
        let reloj = new Date();
        let mes = reloj.getMonth() + 1;
        return new Promise( (resolve, reject) => {
            if( parseInt(reloj.getDate())==inicio_de_mes ){
                base_de_datos.query(`DELETE FROM ${data_base}.${tabla_de_datos} WHERE Mes<${mes};`, err => {
                    if(err){
                        console.log("Error: ", err);
                        reject(err);
                    } else {
                        //console.log("Se han borrado los datos con exito");
                    }
                })
            } else  {
                base_de_datos.query(`DELETE FROM ${data_base}.${tabla_de_datos} WHERE Mes=${mes} AND Dia<${parseInt(reloj.getDate())} AND Hora<23;`,  err => {
                    if(err){
                        console.log("Error: ",err)
                        reject(err);
                    } else {
                        //console.log("Se ha borrado los datos de la base de datos con exito");
                    }
                })
            }
        })
    },confirmar_data: () => {
        let id = 2;
        let reloj = new Date();
        let hora = reloj.getHours();
        let hace_un_minuto = parseInt(reloj.getMinutes())-1;
        if( parseInt(reloj.getMinutes) == 0 ){
            if(hora == 0){
                hora = 23;
            } else {
                hora = parseInt(reloj.getHours()-1);
            }
            hace_un_minuto = 59;
        }
        return new Promise( (res,rej) => {
            base_de_datos.query(`SELECT Temperatura, Hora, Minuto FROM monitoreo.Bitacora WHERE id=${id} AND Hora=${hora} AND Minuto=${hace_un_minuto} ORDER BY turno DESC LIMIT 1;`
            ,(err,data,otro)=>{
            if(err){
                console.log(err);
                rej(err);
            } else {
                if(data.length>0){
                    res(data);
                } else {
                    res();
                }
            }
        })
        })
    },data_hace_2_minuto: (id) => {
        let reloj = new Date();
        let hora = reloj.getHours();
        let hace_2_minutos = parseInt(reloj.getMinutes())-2;
        if ( parseInt(reloj.getMinutes()) == 0 ){
            hora = parseInt(reloj.getHours()-1);
            hace_2_minutos = 58;
        } else if ( parseInt(reloj.getMinutes()) == 1 ){
            hora = parseInt(reloj.getHours()-1);
            hace_2_minutos = 59;
        }
        return new Promise( (res,rej)=> {
            base_de_datos.query(`SELECT Temperatura, Hora, Minuto FROM monitoreo.Bitacora WHERE id=${id} AND Hora=${hora} AND Minuto=${hace_2_minutos} ORDER BY turno DESC LIMIT 1;`
            ,(err,data,otro)=>{
                if(err){

                } else {
                    if(data.length>0){
                        res(data);
                    } else {
                        res();
                    }
                }
            })
        })
    }, data_hace_3_minutos: (id) => {
        let reloj = new Date();
        let hora = reloj.getHours();
        let hace_3_minutos = parseInt(reloj.getMinutes())-3;
        if( parseInt(reloj.getMinutes()) == 0){
            hora = parseInt(reloj.getHours()) - 1
            hace_3_minutos = 57;
        } else if( parseInt(reloj.getMinutes()) == 1){
            hora = parseInt(reloj.getHours()) - 1
            hace_3_minutos = 58;
        } else if (parseInt(reloj.getMinutes()) == 2){
            hora = parseInt(reloj.getHours()) - 1
            hace_3_minutos = 59;
        }
        return new Promise( (res,rej)=> {
            base_de_datos.query(`SELECT Temperatura, Hora, Minuto FROM monitoreo.Bitacora WHERE id=${id} AND Hora=${hora} AND Minuto=${hace_3_minutos} ORDER BY turno DESC LIMIT 1;`
            ,(err,data,otro)=>{
                if(err){
                    console.log(err);
                    rej(err);
                } else {
                    if(data.length>0){
                        res(data);
                    } else {
                        res();
                    }
                }
            })
        })
    }, insertar_aproximado: (id,temp_aprox) => {
        let lugar = "Cámara farmacia";
        let tiempo = new Date();
        let mes = tiempo.getMonth() + 1;
        let minuto = tiempo.getMinutes() - 1;
        let hora = parseInt(tiempo.getHours());

        if (parseInt(tiempo.getMinutes())==0){
            minuto = 59;
            hora = hora - 1;
        }
        return new Promise((resolve,reject)=>{
            base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_datos}(Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${temp_aprox}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${hora},${minuto},60,${id},'H. Cardiología S. XXI');`
            , err => {
                if(err){
                    console.log(err);
                    reject(err);
                } else {
                    resolve(1);
                }
            })
        })
    }, registrar_usuario: (nombre,correo,cargo,ubicacion) => {
        return new Promise( (resolve,reject) => {
            base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_usuarios} (Nombre,Correo,Cargo,Ubicacion) VALUES ("${nombre}","${correo}","${cargo}","${ubicacion}");`,
            err => {
                if (err) {
                    console.log(err);
                    let ok = {
                        ok: 0
                    }
                    reject(ok);
                } else {
                    let ok = {
                        ok: 1
                    }
                    resolve(ok);
                }
            })
        })
    },consultar_equipos: (llave) => {
        return new Promise( (res,rej)=>{
            if(llave==0){
                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_equipos} `, (err,data,otro)=>{
                    if(err){
                        console.log(err);
                        rej(err);
                    } else {
                        res(data);
                    }
                })
            } else {
                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_equipos} WHERE Identificador=${llave}`, (err,data,otro)=>{
                    if(err){
                        console.log(err);
                        rej(err);
                    } else {
                        res(data);
                    }
                })
            }
        })

    },recursos_sensores: () => {
        return new Promise ( (resolve, rejected) => {
            base_de_datos.query(`SELECT DISTINCT id, lugar, ubicacion FROM ${data_base}.${tabla_de_recursos};`, (err,data,otro) => {
                if(err){
                    console.log(err);
                    rejected(err);
                } else {
                    resolve(data);
                }
            })
        })
    },
    extraer_temperaturas_recientes: (id) => {
        return new Promise( (res,rej) => {
            let payload = []
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_datos} WHERE ID=${id} ORDER BY turno DESC LIMIT 1;`, (err,data,otro)=>{
                if(err){
                    console.log(err);
                    rej();
                } else {
                    //console.log(data)
                    res(data);
                }
            })
        })
    },insertar_registro: (temperatura, lugar,ID,ubicacion) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth() + 1;
        return new Promise( (resolve,reject) => {
            base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_datos} (Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID,Ubicacion) VALUES ("${lugar}",${temperatura}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${tiempo.getHours()},${tiempo.getMinutes()},${tiempo.getSeconds()},${ID},'${ubicacion}');`), (err,info,otro) =>{
                //console.log("Terminada la busqueda");
                if(err){
                    console.log(err);
                    reject(new Error());
                } else {
                    //console.log("Dato emitido: ");
                    //console.log(info);
                    resolve(info);
                }
            }
        })
    },registrar_nuevo_sensor: (id,ubicacion,piso,lugar,equipo,serie,capacidad,especial) => {
        return new Promise( (resolve,reject) => {
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_recursos} WHERE id=${id}`,(err,coincidencia,otro) => {
                if(err){
                    console.log(err)
                    reject()
                } else {
                    console.log(coincidencia.length)
                    if(coincidencia.length>0){
                        console.log("Ya está registrado el dato")
                        let ok = {
                            ok: 2
                        }
                        resolve(ok)
                    }
                    else {
                        base_de_datos.query(`INSERT INTO ${data_base}.${tabla_de_recursos} (id,ubicacion,piso,lugar,equipo,serie,capacidad,especial) VALUES (${id},'${ubicacion}','${piso}','${lugar}','${equipo}','${serie}','${capacidad}','${especial}');`, (err,data,otro)=>{
                            if(err){
                                console.log(err);
                                reject()
                            } else {
                                console.log(data);
                                resolve(data)
                            }
                        })                        
                    }
                }
            })
        })
    },getMesas: () => {
        return new Promise( (resolve,reject) =>{
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas}`,(err,data)=>{
                if(err){
                    console.log(err);
                    reject();
                } else {
                    resolve(data)
                }
            })
        })
    },getEquipos: (unidad,equipos) => {
        return new Promise( (resolve,reject)=>{
            if(unidad==='ALL'){
                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas}`,(err,data)=>{
                    if(err){
                        console.log( err )
                        reject()
                    } else {
                        resolve(data)
                    }

                })                
            } else {
                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}"`, (err,data) => {
                    if(err){
                        console.log(err)
                        reject()
                    } else {
                        resolve(data);
                    }
                })
            }
        })

    },busqueda: (unidad,payload,nivel) => {
        return new Promise ((resolve,reject)=> {
            if(unidad==='ALL'){
                {
                    console.log("payload mide: ",payload[0].length)
                    if(payload[0].length<4){
                        console.log("Fue menor a 4");
                        if(isNaN(payload)){
                            console.log("No es un numero");
                            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad LIKE "%${payload}%"`,(err,data) => {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                } else {
                                    if (data.length>0){
                                        console.log("resuelto en codigo unidad");
                                        resolve(data);
                                    } else {
                                        base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE inventario LIKE "%${payload}%"`,(err,data) => {
                                            if(err){
                                                console.log(err);
                                                reject(err);
                                            } else {
                                                if(data.length>0){
                                                    resolve(data)
                                                } else {
                                                    base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE serie LIKE "%${payload}%"`, (err,data) => {
                                                        if(err){
                                                            console.log(err);
                                                            reject(err);
                                                        } else {
                                                            if(data.length>0){
                                                                resolve(data)
                                                            } else {
                                                                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE unidad_abrev LIKE "%${payload}%"`,(err,data) => {
                                                                    if(err){
                                                                        console.log(err);
                                                                        reject(err);
                                                                    } else {
                                                                        if(data.length>0){
                                                                            resolve(data);
                                                                        } else {
                                                                            resolve();
                                                                        }
                                                                    }
                                                                })

                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                            

                        } else {
                            console.log("Si es un numero");
                            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE id=${payload}`,(err,data) => {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                } else {
                                    if(data.length>0){
                                        resolve(data);
                                    } else {
                                        
                                    }
                                    
                                }
                            })
                        }

                    } else {
                        console.log("Fue mayor a 4");                        
                    }
                    
                    base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE inventario LIKE "%${payload}%"`,(err,data) => {
                        console.log("ejecuto otro statement");
                        if(err){
                            console.log("Error en inventario: ",err);
                            reject(err);
                        } else {
                            if(data.length<1){
                                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE equipo LIKE "%${payload}%"`, (err,data2) => {
                                    if(err){
                                        console.log("Error en equipo: ",err);
                                        reject(err);
                                    } else {
                                        if(data2.length<1){
                                            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE marca LIKE "%${payload}%"`, (err,data3) => {
                                                if(err){
                                                    console.log("Error en marca: ",err);
                                                    reject(err);
                                                } else {
                                                    if(data3.length<1){
                                                        base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE serie LIKE "%${payload}%"`,(err,data4)=>{
                                                            if(err){
                                                                console.log("Error en serie: ",err)
                                                                reject(err)
                                                            } else {
                                                                if(data4.length<1){
                                                                    base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE modelo LIKE "%${payload}%"`,(err,data5) => {
                                                                        if(err){
                                                                            console.log("Erorr en modelo: ",err);
                                                                            reject(err);
                                                                        } else {
                                                                            if(data5.length<1){
                                                                                
                                                                                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE unidad LIKE "%${payload}%"`,(err,data6)=>{
                                                                                    if(err){
                                                                                        reject(err);
                                                                                        console.log("Error unidad: ",err)
                                                                                    } else {
                                                                                        if(data6.length>0){
                                                                                            console.log("Resuelto en unidad:");
                                                                                            resolve(data6);
                                                                                        } else {
                                                                                            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE estado LIKE "%${payload}%"`,(err,data)=>{
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    reject(err);
                                                                                                } else {
                                                                                                    if(data.length>0){
                                                                                                        console.log("Promesa resulta en estado")
                                                                                                        resolve(data)
                                                                                                    } else {
                                                                                                        base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE unidad_abrev LIKE "%${payload}%"`,(err,data)=>{
                                                                                                            if(err){
                                                                                                                console.log(err);
                                                                                                                console.log("Promesa rechazada en codigo unidad");
                                                                                                                reject(err);
                                                                                                            } else {
                                                                                                                if(data.length>0){
                                                                                                                    console.log("Promesa resuelta en codigo unidad");
                                                                                                                    resolve(data);
                                                                                                                } else {
                                                                                                                    console.log("Promesa alcanzada en limite mayor a 4");
                                                                                                                    resolve();
                                                                                                                }
                                                                                                                
                                                                                                                
                                                                                                            }
                                                                                                        })
                                                                                                        
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                })
                                                                            
                                                                            } else {
                                                                                console.log("Resuelto en unidad:");
                                                                                resolve(data5)
                                                                            }
                                                                        }
                                                                    })
                                                                    
    
                                                                } else {
                                                                    console.log("Resuelto en modelo:");
                                                                    resolve(data4)
                                                                }
                                                            }
                                                        })
                                                    } else {
                                                        console.log("Resuelto en serie:");
                                                        resolve(data3);
                                                    }
                                                }
                                            })
                                        } else {
                                            console.log("Resuelto en marca:");
                                            resolve(data2);
                                        }
                                    }
                                })
        
                            } else {
                                console.log(data.length);
                                console.log("Resuelto en equipo:");
                                resolve(data);
                            }
                            
                        }
                    })
                }

            } else {
                console.log(payload.length);
                if(payload.length<4){
                    if(isNaN(payload)){
                    } else {
                        try{
                            let id = parseInt(payload);
                            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}" AND id=${id}`,(err,datos) => {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                } else {
                                    if(datos.length>0){
                                        resolve(datos);
                                    }                                    
                                }
                            })
                        } catch (err){
                            console.log(err)
                            reject(err);
                        }
                    }                    
                }                
                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}" AND inventario LIKE "%${payload}%"`,(err,data) => {
                    if(err){
                        console.log(err);
                        reject(err);
                    } else {
                        if(data.length<1){
                            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}" AND equipo LIKE "%${payload}%"`, (err,data2) => {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                } else {
                                    if(data2.length<1){
                                        base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}" AND marca LIKE "%${payload}%"`, (err,data3) => {
                                            if(err){
                                                console.log(err);
                                                reject(err);
                                            } else {
                                                if(data3.length<1){
                                                    base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}" AND serie LIKE "%${payload}%"`,(err,data4)=>{
                                                        if(err){
                                                            console.log(err)
                                                            reject(err)
                                                        } else {
                                                            if(data4.length<1){
                                                                base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}" AND modelo LIKE "%${payload}%"`,(err,data5) => {
                                                                    if(err){
                                                                        console.log(err);
                                                                        reject(err);
                                                                    } else {
                                                                        if(data5.length<1){
                                                                            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_camas} WHERE codigo_unidad="${unidad}" AND estado LIKE "%${payload}%"`,(err,data6)=>{
                                                                                if(err){
                                                                                    reject(err);
                                                                                    console.log(err)
                                                                                } else {
                                                                                    if(data6.length<1){
                                                                                        resolve();
                                                                                    } else {
                                                                                        resolve(data6);
                                                                                    }
                                                                                }
                                                                            })
                                                                        } else {
                                                                            resolve(data5)
                                                                        }
                                                                    }
                                                                })

                                                            } else {
                                                                resolve(data4)
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    resolve(data3);
                                                }
                                            }
                                        })
                                    } else {
                                        resolve(data2);
                                    }
                                }
                            })
    
                        } else {
                            console.log(data.length);
                            resolve(data);
                        }
                        
                    }
                })
            }
            
        })
        
        
    }
}