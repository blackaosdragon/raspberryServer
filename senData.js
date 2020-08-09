const tokens = require('./querys.js');
let asignar = require('./asignacion.js');

const express = require('express');
const fetch = require('node-fetch');


const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
let port = new SerialPort('/dev/ttyUSB0');
const lector = port.pipe(new Readline({delimiter: '\r\n'}));


let turno = 1;
const sensores_en_total = 2;



const fakedata = `ID: 1.0 temp: 18.3`;
//io.emit('temp',`${fakedata}`);
let teempo = new Date();
let minuto_refresh = parseInt(teempo.getMinutes());
let segundo_refresh = parseInt(teempo.getMinutes());
let temperatura = asignar.string_to_float(fakedata);
let ubicacion = asignar.ubicar_dato(fakedata);
let id = asignar.asignar_id(fakedata);
if(minuto_refresh%1){
    console.log("A ver si sale la data");
    console.log(fakedata);
    /*
    console.log("Hora cumplida");
    console.log(`Dato`);
    //console.log(`${temp} turno: ${turno}`);
    if(id==turno){
        //console.log(`${temp} turno: ${turno}`);
        if(Number.isNaN(temperatura)){
            console.log(`El valor de la temperatura que se quiere ingresar no es un entero: ${temperatura}, es incompatible en la base de datos y no se agregara`);
        } else if(temperatura==undefined){
            console.log(`El valor de la temperatura que se quiere ingresar es ${temperatura}, no es compatible a la base de datos y no se agregara`);
        } else if(temperatura==null) {
            console.log(`El valor de la tamperatura es ${temperatura}`)
        } else if (id == undefined || id == null || Number.isNaN(id)){
            console.log(`El id que se quiere  es ${id} no es valido y no se agregara a la base de datos`);
        } else {
            //console.log(`${temp} turno: ${turno}`);
            //console.log(`Entrando al ciclo y revisando si hay un dato repetido. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
            tokens.buscar_repetido(turno).then(response=>{
                console.log(`Tamaño de la respuesta: ${response.length}`);
                if(response.length>0){
                    console.log(`Para el id ${id} ya existe un dato guardado. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
                } else {
                    console.log(`En el turno ${turno} se guardo: ${ubicacion} a ${temperatura} id: ${id}. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
                    tokens.insertar_valores(temperatura,ubicacion,id);
                    */
                    let data = {
                        temperatura: 10,
                        ubicacion: 'sala',
                        id: '1.0'
                    }
                    
                    fetch('http://192.168.0.10:5000/temperatura',{
                        method: 'post',
                        body: JSON.stringify(data),
                        headers:{
                            'Content-Type': 'application/json' 
                          },
                    }).then(response=>{
                        return response.json();
                    }).then(data=>{
                        console.log(data);
                    }).catch((err)=>{
                        console.log("Error:");
                        console.log(err);
                    })/*
                    
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    } 
    turno++;
    if(sensores_en_total<turno){
        turno=1;
    }*/
} else {
    console.log("No entro al if");
    let data = {
        temperatura: 10,
        ubicacion: 'sala',
        id: '1.0'
    }
    fetch('http://192.168.0.10:5000/temperatura',{
                        method: 'post',
                        body: JSON.stringify(data),
                        headers:{
                            'Content-Type': 'application/json' 
                          },
                    }).then(response=>{
                        return response.json();
                    }).then(data=>{
                        console.log(data);
                    }).catch((err)=>{
                        console.log("Error:");
                        console.log(err);
                    })
    turno=1;
}







lector.on('data', temp => {
    console.log(temp);
    let teempo = new Date();
    let minuto_refresh = parseInt(teempo.getMinutes());

    let temperatura = asignar.string_to_float(temp);
    let ubicacion = asignar.ubicar_dato(temp);
    let id = asignar.asignar_id(temp);


    if(minuto_refresh%2 == 0){
        console.log(`Dato`);
        //console.log(`${temp} turno: ${turno}`);
        if(id==turno){
            //console.log(`${temp} turno: ${turno}`);
            if(Number.isNaN(temperatura)){
                console.log(`El valor de la temperatura que se quiere ingresar no es un entero: ${temperatura}, es incompatible en la base de datos y no se agregara`);
            } else if(temperatura==undefined){
                console.log(`El valor de la temperatura que se quiere ingresar es ${temperatura}, no es compatible a la base de datos y no se agregara`);
            } else if(temperatura==null) {
                console.log(`El valor de la tamperatura es ${temperatura}`)
            } else if (id == undefined || id == null || Number.isNaN(id)){
                console.log(`El id que se quiere  es ${id} no es valido y no se agregara a la base de datos`);
            } else {
                //console.log(`${temp} turno: ${turno}`);
                //console.log(`Entrando al ciclo y revisando si hay un dato repetido. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
                tokens.buscar_repetido(turno).then(response=>{
                    console.log(`Tamaño de la respuesta: ${response.length}`);
                    if(response.length>0){
                        console.log(`Para el id ${id} ya existe un dato guardado. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
                    } else {
                        console.log(`En el turno ${turno} se guardo: ${ubicacion} a ${temperatura} id: ${id}. ${teempo.getHours()} : ${teempo.getMinutes()} : ${teempo.getSeconds()}`);
                        tokens.insertar_valores(temperatura,ubicacion,id);
                        let data = {
                            temperatura: temperatura,
                            ubicacion: ubicacion,
                            id: id
                        }
                        fetch('https://instrumentacionline.ddns.net/temperatura',{
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers:{
                                'Content-Type': 'application/json' 
                              },
                        }).then(response=>{
                            return response.json();
                        }).then(data=>{
                            console.log(data);
                        }).catch((err)=>{
                            console.log("Error:");
                            console.log(err);
                        })
                        
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
        } 
        turno++;
        if(sensores_en_total<turno){
            turno=1;
        }
    } else {
        turno=1;
    }
})
