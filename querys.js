const mySql = require ('mysql');
const fs = require('fs');
const { resolve } = require('path');
const { Console } = require('console');
const base_de_datos = mySql.createConnection({
    host: 'localhost',
    user: 'infoUpdater',
    password: '107005205',
    
})
const data_base = 'monitoreo';
const tabla_de_datos = 'Bitacora';
const tabla_daly = 'dalyData';
const tabla_test = 'test';
let tokens = [];

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
    },
    insertar_valores: (temperatura, lugar,ID) => {
        let tiempo = new Date();
        let mes = tiempo.getMonth()+1;
        base_de_datos.query(`INSERT INTO monitoreo.Bitacora(Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID) VALUES ("${lugar}",${temperatura}, ${tiempo.getDate()},${mes},${tiempo.getFullYear()},${tiempo.getHours()},${tiempo.getMinutes()},${tiempo.getSeconds()},${ID});`,(err,values,data)=>{
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
            console.log("khe");
            console.log(datos);
            //console.log(campos);
        })
    }
    ,
    extraer_años: (ubicacion) => {
        let elementos = [];
        console.log("Ubicacion en la base: ",ubicacion);
        console.log("Buscando años");
        return new Promise( (resolve,reject) => {
            //let elementos = [];
            base_de_datos.query(`SELECT DISTINCT Año FROM ${data_base}.${tabla_de_datos} WHERE Lugar='${ubicacion}';`,(err,data,campos)=>{
                if (err){
                    reject(new Error());
                    console.log(err);
                } else {
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].Año;
                    }
                    console.log(elementos);
                    resolve(elementos);
                    console.log("Años enviados");
                }
            })
        })
    },extraer_dias: (mes,year,lugar) => {
        console.log("consultando los dias");
        let meSiguiente = parseInt(mes)+1;
        let dia_primero = 1;
        let dia_final = 1;
        
        if (mes==12){
            dia_final = 31;
            meSiguiente = 12;
        }

        return new Promise( (resolve,reject) => {
            let elementos = [];
            base_de_datos.query(`SELECT DISTINCT Dia AS dia FROM ${data_base}.${tabla_de_datos} WHERE Año=${year} AND Lugar='${lugar}' AND Mes=${mes};`, (err,data,otro) => {
                if (err){
                    reject(new Error());
                    console.log(err);
                } else {
                    for(let i=0;i<data.length;i++){
                        elementos[i] = data[i].dia;
                    }
                    console.log(elementos);
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
                console.log(elementos);
            })
        })
    },
    extraer_mes: (year) => {
        return new Promise((resolve,reject)=>{
            let elementos =[];
            base_de_datos.query(`SELECT DISTINCT Mes AS mes FROM ${data_base}.${tabla_de_datos} WHERE Año=${year};`,(err,data,filas)=>{
                if(err){
                    reject (new Error());
                }
                else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].mes;
                    }
                    
                    resolve(elementos);
                }
                console.log(elementos);
            })
            
        })        
    },
    extraer_dia: (year,mes) => {
        console.log("Consultando los dias");

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
                    console.log(elementos);
                    resolve(elementos);
                }
                console.log(elementos);
            });
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
            base_de_datos.query(`SELECT DISTINCT Lugar AS lugar FROM ${data_base}.${tabla_de_datos};`,(err,data,otro)=>{
                if(err){
                    reject(new Error());
                }else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].lugar;
                    }
                    
                    resolve(elementos);
                }
                console.log(elementos);
            })
        })
    },obtener_nombre:(ubication,year,mes,dia)=>{
        return new Promise((resolve,reject)=>{
            let name = `Consulta_${ubication}_${year}-${mes}-${dia}.csv`
            console.log(`Generando el nombre: ${name}`)
            
            if(ubication.length<0||year<0||mes<0||dia<0){
                reject(()=>{
                    console.log("Alguno de los datos no es compatible o no existe");
                })
            }
            resolve(name);
        })
    },
    consultar_base_de_datos: (ubication,year,mes,dia,name) => {
        console.log(`Obteniendo el nombre para la consulta: ${name}`);
        //console.log(`Lugar: ${ubication} ${dia}/${mes}/${year}, Hora: ${hora_inicial}:${minuto_inicial} - ${hora_final}:${minuto_final}`)
        return new Promise( (resolve,reject) => {
            let elementos = [];
            //let name = `Consulta_${ubication}_${year}-${mes}-${dia}.csv`
            console.log(`SELECT Lugar AS ubicacion,Temperatura AS temperatura, Dia,Mes,Año FROM monitoreo.Bitacora WHERE Lugar='oficina' AND Dia=29 AND Mes=6 AND Hora>0 AND Hora<24;`)
            base_de_datos.query(`SELECT Lugar AS ubicacion,Temperatura AS temperatura, Dia,Mes,Año,Hora,Minuto,Segundo FROM ${data_base}.${tabla_de_datos} WHERE Lugar='${ubication}' AND Dia=${dia} AND Mes=${mes} AND Hora>=0 AND Hora<=24 AND Año=${year} ;`,(err,data,otro)=>{
                if(err){
                    console.log(err);
                    reject(new Error());
                } else {
                    console.log(`Creando la cabecera del archivo: ${name}`)
                    fs.appendFile(`${name}`,`"Consulta de ${ubication} con fecha de ${dia}/${mes}/${year}"\n "Lugar"; "Temperatura"; "Hora"; "Minuto";\n`,function(err){
                        if(err){
                            throw err;
                        }
                        //console.log('Guardado');

                    })
                    console.log(`Para cada elemento en el archivo: ${name}`)
                    data.forEach((element,i) => {  
                        //console.log(`${element.ubicacion} ${element.temperatura} ${element.fecha}`)                  
                        fs.appendFile(`${name}`,`"${element.ubicacion}"; "${element.temperatura}°C"; "${element.Hora}";"${element.Minuto}" \n`,function(err){
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
                    console.log("Archivo creado y actualizado");
                    resolve(elementos);
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
            base_de_datos.query(`SELECT * FROM monitoreo.Bitacora WHERE ID=${id_turno} AND Año=${tiempo.getFullYear()} AND Mes=${mes} AND Dia=${tiempo.getDate()} AND Hora=${tiempo.getHours()} AND Minuto>=${tiempo.getMinutes()}`,(err,data,otro)=>{
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
        
    },
    obtener_datos: () => {
        console.log("Buscando en emit");
        let sentancia_1 = ``
        return new Promise( (resolve,reject) => {
            base_de_datos.query(`SELECT * FROM ${data_base}.${tabla_de_datos}`), (err,info,otro) =>{
                console.log("Terminada la busqueda");
                if(err){
                    console.log(err);
                    reject(new Error());
                } else {
                    console.log("Dato emitido: ");
                    console.log(info);
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
                             console.log(data[0].data1==user);
                             console.log(`${user}`);
                             console.log(data[0].data2==pass);
                             console.log(`${pass}`);
                             if(data[0].data1==`${user}` && data[0].data2==`${pass}`){
                                 console.log("Se encontro coincidencia")
                               //console.log(data.data1);
                               //console.log(data.data2);
                                 let success = {
                                     data: 1
                                 }
                                 resolve(success);
                           } else {
                               if(data[0].data1!=user){
                                   console.log("No coincide el nombre de usuario");
                               } else if (data[0].data2!=pass){
                                   console.log("No coincide la contraseña");
                               } else {
                                   console.log("No hubo algún tipo de coincidencia");
                               }
                               let unsuccessfully = {
                                   data: 0
                               }
                               resolve(unsuccessfully);
                           }
                        } else {
                            console.log("No hubo coincidencia");
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
            base_de_datos.query(`SELECT * FROM  ${data_base}.${tabla_daly}`,(err,datos,campos)=>{
                if(err){
                    console.log(err);
                    reject(new Error());
                }
                else {
                    console.log(datos.length);
                    console.log(`${datos[0].Lugar}`);
                    console.log(datos[0].Temperatura);
                    console.log(datos[0].Año);
                    console.log(datos[0].Dia);
                    console.log(datos[0].Mes);
                    console.log(datos[0].Hora);
                    console.log(datos[0].Minuto);
                    resolve(datos);
                }
            })
        })
        

    }
}