module.exports = function string_to_float(data_reciber){
    let string_ofice_temperature = "";
    let float_ofice_temperature = 0.0;
    for(let i = 15; i <= 18; i++){
        string_ofice_temperature = string_ofice_temperature+data_reciber[i];
    }
    if(parseFloat(string_ofice_temperature)){
        console.log("Se puede transformar a float");
    }
    //float_ofice_temperature = string_ofice_temperature
    //console.log(string_ofice_temperature)
    return string_ofice_temperature;
}