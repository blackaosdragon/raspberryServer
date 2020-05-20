module.exports = function string_to_float(data_reciber){
    if (data_reciber==="No se ha recibido datos"){

    }
    
    let string_ofice_temperature = "";
    let float_ofice_temperature = 0.0;

    let mensaje_tamanio = data_reciber.length
    console.log(mensaje_tamanio);

    for(let i = 15; i <= 18; i++){
        string_ofice_temperature = string_ofice_temperature+data_reciber[i];
    }
    //console.log(parseFloat(string_ofice_temperature))
    if(string_ofice_temperature=="")
    if(parseFloat(string_ofice_temperature)){
        return float_ofice_temperature = parseFloat(string_ofice_temperature);
    } else {
        
    }
    //float_ofice_temperature = string_ofice_temperature
    //console.log(string_ofice_temperature)
    //return string_ofice_temperature;
}