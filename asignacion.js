module.exports = {
    string_to_float: (data_reciber) => {
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
    //if(string_ofice_temperature=="")
      if(parseFloat(string_ofice_temperature)){
          return float_ofice_temperature = parseFloat(string_ofice_temperature);
      } else {
        
      }
      //float_ofice_temperature = string_ofice_temperature
      //console.log(string_ofice_temperature)
      //return string_ofice_temperature;
  },
  ubicar_dato: (data_reciber) => {
      let length_mensaje = data_reciber.length;
      let string_id = "";
      let float_id = 0.0;
      for (let i=0; i<8;i++){
          string_id = string_id + data_reciber[i];
      }
      if(float_id==1.0){

      } else if (float_id==2.0){

      } else if (float_id == 3.0){

      }
      console.log(`Tamaño del mensaje: ${length_mensaje} id: ${string_id}`);
  }

}