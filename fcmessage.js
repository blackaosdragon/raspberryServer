const tokens = require('./querys.js');

module.exports = {
    sendPushAlert = (float_ofice_temperature, alertas, integer_alertas) => {
        let un_minuto = 150;
        if (alertas>0){
            if(integer_alertas % un_minuto === 0) {
                let envios = tokens.asignar_tokens();
                if(Object.entries(envios).length === 0){
                    console.log("Objeto vacio");
                }
                console.log(envios);
            }
        }
    }
}