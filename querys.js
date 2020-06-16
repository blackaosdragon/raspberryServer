const mySql = require ('mysql');
const base_de_datos = mySql.createConnection({
    host: 'localhost',
    user: 'infoUpdater',
    password: '107005205',
    
})
let tokens = [];

module.exports = {
    asignar_tokens: () => {
        base_de_datos.query("SELECT * FROM tokens.Tokens", (err, token, campos)=>{
            if(err){
                console.log(err);
            }
            for (let contador = 0; contador<token.length; contador++){
                tokens[contador] = token[contador].token;
            }
            return tokens;
        })
        return tokens;
    },
    insertar_valores: (temperatura, lugar) => {
        base_de_datos.query(`INSERT INTO monitoreo.Registro (registro, ubicacion, valor, fecha) VALUES (NULL, '${lugar}', '${temperatura}', CURRENT_TIMESTAMP)`,(err,values,data)=>{
            if(err){
                console.log(err);
            }
        })
    },
    consultar_base: () => {
        base_de_datos.query(`SELECT * FROM  monitoreo.Registro`,(err,datos,campos)=>{
            if(err){
                console.log(err);
            }
            console.log(datos);
            console.log(campos);
        })
    },
    extraer_años: (ubicacion) => {
        //let elementos = [];
        return new Promise( (resolve,reject) => {
            let elementos = [];
            base_de_datos.query(`SELECT DISTINCT (extract(year FROM fecha)) AS año FROM monitoreo.Registro WHERE ubicacion='${ubicacion}';`,(err,datos,campos)=>{
                if (err){
                    reject(new Error());
                    console.log(err);
                } else {
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].año;
                    }
                    resolve(elementos);
                }
            })
        })
                
        /*callback(
            base_de_datos.query(`SELECT DISTINCT (extract(year FROM fecha)) AS año FROM monitoreo.Registro`,(err,datos,campos)=>{
                if(err){
                    console.log(err);
                }
                for (let i = 0; i<datos.length;i++){
                    elementos[i] = datos[i].año;
                    //console.log(datos[i].año);
                }
  
                console.log("Antes de salir del query: "+elementos);
                //return[elementos];

            })
            
        );*/
        
            /*base_de_datos.query(`SELECT DISTINCT (extract(year FROM fecha)) AS año FROM monitoreo.Registro`,(err,datos,campos)=>{
              if(err){
                  console.log(err)
              }
              //console.log(datos);
              for (let i = 0; i<datos.length;i++){
                  elementos[i] = datos[i].año;
                  //console.log(datos[i].año);
              }

              console.log("Esto tarda en salir: "+elementos);
              return[elementos];
              //console.log(campos);
          })*/
          
          //return[elementos];
        
    },
    extraer_datos:()=>{
        return new Promise((resolve,reject)=>{
            let elementos =[];
            base_de_datos.query(`SELECT DISTINCT (extract(year FROM fecha)) AS año FROM monitoreo.Registro;`,(err,data,filas)=>{
                if(err){
                    reject (new Error());
                }
                
                else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].año;
                    }
                    
                    resolve(elementos);
                }
                console.log(elementos);
            })
        })
    },
    extraer_mes: (year) => {
        return new Promise((resolve,reject)=>{
            let elementos =[];
            base_de_datos.query(`SELECT DISTINCT (extract(month FROM fecha)) AS mes FROM monitoreo.Registro WHERE fecha>'${year}-01-01'`,(err,data,filas)=>{
                if(err){
                    reject (new Error());
                }
                else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].mes;
                    }
                    
                    resolve(elementos);
                }
                console.log(elementos);
            })
            
        })        
    },
    extraer_dia: (year,mes) => {
        console.log("Consultando los dias");

        let meSiguiente = parseInt(mes)+1;
        let dia_primero = 1;
        let dia_final = 1;
        if(mes==12){
            meSiguiente = 12;
            dia_final = 31;
        }
        return new Promise((resolve,reject)=>{
            let elementos = [];
            base_de_datos.query(`SELECT DISTINCT (extract(day FROM fecha)) AS dia FROM monitoreo.Registro WHERE fecha>= '${year}-${mes}-${dia_primero}' AND fecha<'${year}-${meSiguiente}-${dia_final}';`,(err,data,otro)=>{
                if(err){
                    reject(new Error()); 
                    console.log(err);
                } else {
                    for(let i=0;i<data.length;i++){
                        elementos[i] = data[i].dia;
                    }
                    console.log(elementos);
                    resolve(elementos);
                }
                console.log(elementos);
            });
        })
    },
    extraer_ubicacion: () => {
        return new Promise((resolve,reject)=>{
            let elementos = [];
            base_de_datos.query(`SELECT DISTINCT ubicacion AS lugar FROM monitoreo.Registro;`,(err,data,otro)=>{
                if(err){
                    reject(new Error());
                }else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].lugar;
                    }
                    
                    resolve(elementos);
                }
                console.log(elementos);
            })
        })
    },
    consultar_base_de_datos: (ubication,year,mes,dia,hora_inicial,minuto_inicial,hora_final,minuto_final) => {
        return new Promise( (resolve,reject) => {
            let elementos = [];
            base_de_datos.query(`SELECT ubicacion,valor AS temperatura, fecha FROM monitoreo.Registro WHERE ubicacion='${ubication}' AND fecha>='${year}-${mes}-${dia} ${hora_inicial}:${minuto_inicial}:00' AND fecha<'${year}-${mes}-${dia} ${hora_final}:${minuto_final}:00;'`,(err,data,otro)=>{
                if(err){
                    console.log(err);
                    reject(new Error());
                } else {
                    data.forEach((element,i) => {                      
                        elementos[i]={
                            ubicacion: element.ubicacion,
                            temperatura: element.temperatura,
                            fecha: element.fecha
                        }                       
                    });
                    resolve(elementos);
                }
            })
        })
    },    
}