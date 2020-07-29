module.exports = {
    string_to_float: (data_reciber) => {
        //tiempo de expera agotado
      
      if (data_reciber==="No se ha recibido datos"){

      }
      let string_ofice_temperature = "";
      let float_ofice_temperature = 0.0;

      let mensaje_tamanio = data_reciber.length
      //console.log(mensaje_tamanio);
      if(mensaje_tamanio>22){
          return float_ofice_temperature=null;
      }

      for(let i = 15; i <= 18; i++){
          string_ofice_temperature = string_ofice_temperature+data_reciber[i];
      }
      
      if(parseFloat(string_ofice_temperature)){
        //console.log(`Antes de devolver: ${string_ofice_temperature}`);
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
      for (let i=4; i<8; i++){
          string_id = string_id + data_reciber[i];
      }
      if(parseFloat(string_id)){
          float_id = parseFloat(string_id);
      } else {
          //console.log("El dato no puede convertirse a float")
      }
      if(float_id==1.0){
          return "Camara fria farmacia";
      } else if (float_id==2.0){
          return "taller";
      } else if (float_id == 3.0){
          return "refrigerador";
      } else if (float_id == 4.0){
          return "nueva ubicacion"
      } else if (float_id == 5.0){
          return "nuevo sensor"
      }
  },
  asignar_id: (data_reciber) => {
      //console.log(data_reciber);    
      let string_id = "";
      let float_id = 0.0;
      for (let i=4; i<8; i++){
        string_id = string_id + data_reciber[i];
      }
      if(parseInt(string_id)){
          return parseInt(string_id);
      }
  }
}