const SerialPort = require('serialport');
const https = require('https');
const fetch = require('node-fetch');
const ReadLine = SerialPort.parsers.Readline;
let port = new SerialPort('/dev/ttyUSB0');
const lector = port.pipe(new ReadLine({delimiter: '\r\n'}));

let temp_string = "";
let temp_float = 0;
let id_string = "";
let id_integer = 0;

const end_point = "https://instrumentacionline.ddns.net:5002/temperatura";
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})

lector.on('data', line => {
    console.log(`> ${line}`);
    for(let i=0; i<4; i++){
        id_string = id_string + line[i];
    }
    id_integer = parseInt(id_string);
    id_string = "";
    if(Number.isNaN(id_integer)){
        console.log("No se pudo convertir el id");
    } else {
        for(let i = 4; i<11; i++){
            temp_string = temp_string + line[i];
        }
        if(Number.isNaN(temp_string)){
            console.log("No se pudo convertir la temperatura");
        } else {
            temp_float = parseFloat(temp_string)
            //console.log(`id = ${id_integer} temp = ${temp_float}`);
            let payload = {
                temperatura: temp_float,
                id: id_integer
            }
            console.log(payload)
            fetch(`${end_point}`,{
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                },
                agent: httpsAgent
            }).then( response => {return response.json()})
            .then( data => {
                console.log(data);
            }).catch( error => {
                console.log(error);
            })
        }
    }
    
    
    /*
    */
    /*
    fetch('https://instrumentacionline.ddns.net/temperatura',{
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json' 
            },
            agent: httpsAgent
        }).then(response=>{
            return response.json();
        }).then(data=>{
            console.log(data);
        }).catch((err)=>{
            console.log("Error:");
            console.log(err);
        })*/
})
