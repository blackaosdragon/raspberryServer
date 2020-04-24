const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require("/home/ubuntu/home-8bea3-firebase-adminsdk-ilfkz-544a451f7b.json");
const mysql = require('mysql');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://home-8bea3.firebaseio.com/'
});

const dataBase = mysql.createConnection({
 host: 'localhost',
 user: 'infoUpdater',
 password: '107005205',
 database: 'tokens'
});

/* prueba de conexion a base de datos
dataBase.connect( error => {
 if (error){
  console.log('Error: ',error);
 } else {
  console.log('Conexion exitosa a la base de datos');
 }
})
*/

// dataBase.query("SELECT * FROM Tokens",(error,resultado,campos) => {
  var tokens = [] ;

  colocarTokens = () => {
    dataBase.query("SELECT * FROM Tokens",(error,datos,campos) => {
      if (error){
        console.log("Error: ",error);
      }
      asignarTokensdeEnvio(datos)
      /*
      for(let iContador = 0; datos.length > iContador; iContador++){
        tokens[iContador] = datos[iContador].token;
        console.log(tokens[iContador])
      }
      */
      console.log(tokens);
    })
    return tokens;
  }

  asignarTokensdeEnvio = (datos) => {
    for(let iContador = 0; datos.length > iContador; iContador++){
      tokens[iContador] = datos[iContador].token;
      console.log(tokens[iContador])
    }
  }

  let payload = {
    data: {
      title: 'Titulo de prueba',
      body: 'Cuerpo del mensaje '
    }
  }
  let options = {
    priority: '',
    timeToLive: 60*60*24
  } 
  colocarTokens();
  console.log(tokens);

  //admin.messaging().send( )

asignarTokens = () => {
 //console.log("asignarTokens");

dataBase.query("SELECT * FROM Tokens",(error,resultados,campos) => {
let tokens = [];
if(error){
  console.log(error);
}
 for(let i = 0; resultados.length>i; i++){
   tokens[i]=resultados[i].token;
 }
 let mensajeInicio = {
   data: {
     prioridad: "3",
     tipo: "Bienvenida",
     titulo: "Servidor en línea",
     contenido: "Monitarizacion de temperatura funcionando",
   },
   tokens: tokens
 }
 let mensajeAdvertencia = {
   data: {
     prioridad: "2",
     tipo: "Advertencia",
     titulo: "Advertencia Temperatura",
     contenido: "Temperatura ligeramente más alta de lo normal",
   }
 }

 const payload = {
   notification: {
     title: 'Prueba de mensaje inmediato',
     body: 'Este mensaje tiene la prioridad alta'
   }
 }
 const options = {
   priority: 'high',
   timeToLive: 60 * 60 * 5
 } 

 admin.messaging().sendMulticast(mensajeInicio).then( respuesta => {
  console.log(respuesta.successCount+' mensajes envidos satisfactoriamente');
 }).catch( error => {
   console.log("Error: ",error);
 })
 
/*
 admin.messaging().sendToDevice(tokens, payload, options).then( response => {
   console.log('Satisfactorio enviado mensaje; ',response);
 }).catch( error => {
   console.log('Error enviando mensaje: ',error);
 })
 */

 
 //console.log(tokens);
 });
}






const tokensRegistrados =  "coB2bWwL-HbrVSa2ItiJQY:APA91bGuBtz2d6PIbk4YoM-9yf_J4Xue9T9L0XRez4fuCumii5GxTkt5IFesUvmqZegPUnWWa1Dnx9_NSM5XF-Yhg5rL80oyu10ZQGvYUerKdqucN3up3fbqnnmpUxZ3wqo3GY629UEr";
const registrationToken =  "coB2bWwL-HbrVSa2ItiJQY:APA91bGuBtz2d6PIbk4YoM-9yf_J4Xue9T9L0XRez4fuCumii5GxTkt5IFesUvmqZegPUnWWa1Dnx9_NSM5XF-Yhg5rL80oyu10ZQGvYUerKdqucN3up3fbqnnmpUxZ3wqo3GY629UEr";
const  tokenChrome = "cus1e2pFuv0wn6LRWrtdcM:APA91bEsJooQguI_XOmiTqhCAaxHIiKYrPZKx-94W2Hal2ZSCag_RxlmwvY6g-eLJFDOFO_jxRvQ3nH9Ht1Dt76K-o5K3PCy-R8hTsHAad0IUqOxndiLIt2NkmOzmb6F_9rF2mGStl_6";
//const tokenChrome2 = "cus1e2pFuv0wn6LRWrtdcM:APA91bFwnPuLwqv2MqIswTWdBHW3rMrADc8imHKpoQvNhXq3HQDq_jwa2F6ZqZ_FPuyx3hbFUov6LOd6f22oMli4RW3FRMuEySSBo3mqpXaY7j05JrmJFwVD1qletZrrVUz89Or6Erkb"
//const tokenChrome2="coB2bWwL-HbrVSa2ItiJQY:APA91bGeafuHs3FgNr3tAPePIWq85hLOs-rOy57yRccyMGQqkJl3FmCZA9q8XqnIRSflPewl5y06SR354Nl-7tY20ZOL04mr9ul_p7Gmwtn_-81L7oRzMqkvoGA7hpL3UWvPA3uU3apC"
//const tokenChrome2="eFy_lfBklah4dcPz9Pc81t:APA91bGZCYe-xwLAcjMYoSfT6LdLjtYKjVYkSxUvm099xt_V3GpzmJ8YPrbs9hc8gcDoMAyt-G6m3ln_n1vBkgvZnpYbTBCo-8WpNwCvWIPTn_ot1CXGooACf-4uqHsTgIi2zHE9EWaC"
//const tokenChrome2="ftno8SPYtB2sxe1wjTOAgA:APA91bF1ltSIrXod8teDysScanKxQjfPv3plr8C1uotGfFdvRS9q8CkVn7d3x2JBdK8257GL-55F1ZRZSPEuv095FR9HO_jLY4iyP-TaF8LNMplOAXbSkuq4W3_rOYmydVyqfcBh3a-J"
//const tokenChrome2="cPPE2mG3KVWixAB1TKdrPJ:APA91bEdCO5WJiQK6aKRDB9XmoVaNQnLSPpcKA8BGd-gKM5cpbNFDHr8cXvXSwmttsmtKQBMwhMaoDkL2XaLG-V8ocxborVCwqjC_CSdgv6NRVV2torlsImhKv91XhQuqz4K-dZAc5aL"
//  const tokenChrome2="dFMdhw5cnfsApqZaYRRNZy:APA91bHvhs1gHBD4TAV-XdabyHO5eZlVqHlSnAtme81MCp2SCYAr2NF48toebmmVO8KgIn8kkDcMI_nqReM9V10yynuDiVkb12IB1_0XL30OhAeczCViSctdeZ6A8UO6pStrA1OIzeHW"
//  const tokenChrome2="cPPE2mG3KVWixAB1TKdrPJ:APA91bHdtJbB9HtAKlrI1wrzFPcYTSSrwrU1xJXzDFBLgKL6DJ8HzJiQqBM41V4hESK01N87YK9Ks-znjy24Fi_ZwpYLd95mG3W95Uv6oh8zThN-sWRtA3pb0y0Y4sdjY3MFjOX8-vyi"
//const tokenChrome2="cPPE2mG3KVWixAB1TKdrPJ:APA91bHdtJbB9HtAKlrI1wrzFPcYTSSrwrU1xJXzDFBLgKL6DJ8HzJiQqBM41V4hESK01N87YK9Ks-znjy24Fi_ZwpYLd95mG3W95Uv6oh8zThN-sWRtA3pb0y0Y4sdjY3MFjOX8-vyi"
const tokenChrome2="egAH-2V3aULEWt7CTZ1ujl:APA91bGaGmHA_RUKK6FRXbT8tMROnHb1qKjHcaU-wBHG5N7UpCP_nlZFyI_KJ2-sIcYyPPY-p3KXN-tZaNTB3zFxafsD76mMBum2VWV3u6pfmWKXmJGTiZOyNqgb9hXTAH_UUmRBfTQA"
//const tokenChrome2 = "cus1e2pFuv0wn6LRWrtdcM:APA91bFwnPuLwqv2MqIswTWdBHW3rMrADc8imHKpoQvNhXq3HQDq_jwa2F6ZqZ_FPuyx3hbFUov6LOd6f22oMli4RW3FRMuEySSBo3mqpXaY7j05JrmJFwVD1qletZrrVUz89Or6Erkb";
const tokenChrome3 = "cus1e2pFuv0wn6LRWrtdcM:APA91bFwnPuLwqv2MqIswTWdBHW3rMrADc8imHKpoQvNhXq3HQDq_jwa2F6ZqZ_FPuyx3hbFUov6LOd6f22oMli4RW3FRMuEySSBo3mqpXaY7j05JrmJFwVD1qletZrrVUz89Or6Erkb";
let dataGlobal = "";

//libreria del puerto serial
const puerto = 443; //puerto por donde se encuentra el servidor
/*
const server = app.listen(puerto,()=>{
  console.log(`Servidor abierto en el puerto ${puerto}`);
});
*/

const httpServer = https.createServer({
 key: fs.readFileSync(path.resolve('/home/ubuntu/privkey.pem')),
 cert: fs.readFileSync(path.resolve('/home/ubuntu/cert.pem'))

},app)

httpServer.listen(puerto,()=>{
 console.log(`Servidor disponible en el puerto ${puerto}`);
})

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
//const parser = port.pipe(new ReadLine({delimiter: '\r\n'}));
const parser = port.pipe(new Readline({delimiter: '\r\n'}));
const io = require('socket.io')(httpServer);
let tempString = "";
let tempFloat = 0.0;


// este es elcodigo anterior que si funciona
/* notificaciones
let payload = {
  data: {
    MyKey1: "Alerta",
  },
};
let options = {
  priority: "high",
  timeToLive: 60*60*24
  }
admin.messaging().sendToDevice(tokenChrome3,payload,options).then( response => {
  console.log('Mensaje satisfactorio: ',response);
}).catch( err => {
  console.log('Error: ',err);
});
*/

/*
var message = {
 data: {
  data: 'test',
  info: 'prueba'
 },
 token: tokenChrome2
};

admin.messaging().send(message)
.then(response=>{
console.log("Mensaje satisfactorio: ",response);
})
.catch(error => {
 console.log("Error mandando mensaje: ",error);
})
*/
let notifiConta = 90;
parser.on('data',(temp)=>{
 dataGlobal = temp;
 io.emit('temp',temp);
 for (let i = 15; i <= 18; i++){
   tempString = tempString+dataGlobal[i];
 }
 tempFloat = parseFloat(tempString);
 if (temp > 28.0){
   notifiConta = notifiConta + 1;
   console.log("Contador: ",notifiConta);
   //console.log("Modulo: ",100%notifiConta);

} else if (temp<=28.0){
  notifiConta = 0
} 
if (100%notifiConta==0){
  console.log("Notificacion de alerta");
}
/*
  dataBase.query("SELECT * FROM Tokens", (error,resultados,campos) => {
    if(error){
      console.log(error);
    }
    asignarTokensdeEnvio(resultados);
    let payload = {
      data: ``
    }
  })*/

/* 
   //console.log("Notificacion de precaucion");
   let notifiOficina = {
     notification: {
      title: "Advertencia",
      body: `La temperatura supera los ${tempFloat}°C revisar el sensor`
     }
 */
  

 //console.log(tempFloat);
 tempString = "";
})

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

let dataSensor = {
 sensor: 'Taller',
 ubicacion: 'Planta baja',
}
let sensorVariable = {
 sensor: 'Bodega',
 ubicacion: 'Planta baja'
}
// inicia parte de al API rest
app.post('/token',function(req,res){
 let token = req.body.token;
 let coincide = 0;
 let a = 0;
 dataBase.query("SELECT * FROM Tokens",(error,resultado,campos) => {
// console.log("Resultados: ",resultado);
// console.log(resultado[0]);
 for(let i=0; resultado.length > i && coincide == 0; i++){
  //console.log(resultado[i].token);
  if(resultado[i].token!=token){
   a++;
  }
  if(a==resultado.length){
   console.log("Se agregara un nuevo token");
   dataBase.query(`INSERT INTO Tokens (usuario,token) VALUES (NULL,'${token}')`);
  }
  if(resultado[i].token===token){
   console.log("El token ya existe");
   coincide = 1;
  }
  //console.log(i); solo para pruebas
  //console.log(a);
  //console.log(resultado.length);
 } //fin del for

 });
 console.log("Token: ",token);
 res.end("yes");
}); //fin del post

app.get('/sensor',function (req,res){
 //res.send(dataGlobal[4])
 if(dataGlobal[4]==='1'){
  let sValor = "";
  let fValor = 0;
 for(let i = 15; i <= 18; i++){
  sValor = sValor + dataGlobal[i];
 }
  //takeValor(sValor,dataGlobal);
  fValor = parseFloat(sValor);
  let registro = new Date;
  let response = {
  temperatura: fValor,
  info: dataSensor,
  fecha: registro.getMonth() + " / " + registro.getDate() + " / " + registro.getFullYear(),
  hora: registro.getHours() + ":" + registro.getMinutes() + ":" + registro.getSeconds()
  }
 res.send(response);
 }
 if(dataGlobal[4]==='3'){
  let sValor = "";
  let fValor = 0;
  let registro = new Date;
  for (let i = 15; i <= 18; i++){
   sValor = sValor + dataGlobal[i];
   fValor = parseFloat(sValor);
  }
  let response = {
   temperatura: fValor,
   info: sensorVariable,
   fecha: registro.getMonth() + " / " + registro.getDate() + " / " + registro.getFullYear(),
   hora: registro.getHours() + ":" + registro.getMinutes() + ":" + registro.getSeconds()
  }
 res.send(response);
 }
 if(dataGlobal[4]==='2'){
  let sValor = "";
  let fValor = 0;
  let registro = new Date;
  for (let i = 15; i<=18; i++){
    sValor = sValor + dataGlobal[i];
    fValor = parseFloat(sValor);
  }
   let response = {
   temperatura: fValor,
   info: sensorVariable,
   fecha: registro.getMonth() + " / " + registro.getDate() + " / " + registro.getFullYear(),
   hora: registro.getHours() + ":" + registro.getMinutes() + ":" + registro.getSeconds()
  }
  res.send(response);
 }

})
//asignarTokens();
