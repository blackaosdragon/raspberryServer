module.exports = function string_to_float(data_reciber){
    let string_ofice_temperature = "";
    for(let i = 15; i <= 18; i++){
        string_ofice_temperature = string_ofice_temperature+data_reciber[i];
    }
    console.log(string_ofice_temperature)
    return string_ofice_temperature;
}