const tokens = require('./querys.js');
const admin = require('firebase-admin');
const serviceAccount = require("/home/ubuntu/home-8bea3-firebase-adminsdk-ilfkz-544a451f7b.json");
const url_de_base_de_datos = 'https://home-8bea3.firebaseio.com/'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: url_de_base_de_datos
})

module.exports = {
    sendPushAlert: (float_ofice_temperature, alertas, integer_alertas) => {
        let un_minuto = 150;
        if (alertas>0){
            if(integer_alertas % un_minuto === 0) {
                let envios = tokens.asignar_tokens();
                if(Object.entries(envios).length === 0){
                    console.log("Objeto vacio");
                } else {
                    const advertencia = {
                        data: {
                            tipo: "Bienvenida",
                            titulo: "¡Advertencia temperaruta inusual!",
                            contenido: `La temperatura se encuentra a ${float_ofice_temperature}°C`
                        }
                    }
                    const options = {
                        priority: 'high',
                        timeToLive: 10 * 0 * 0
                    }
                    admin.messaging().sendToDevice(envios,advertencia,options)
                    .then( response => {
                        console.log('Correcta entrega: ', response);
                    }).catch( error => {
                        console.log('Error sending message: ',error);
                    })
                }
                 console.log(envios);
                return envios;
            }
        }
    }
}