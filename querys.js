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
    extraer_años: (nada,callback) => {
        let elementos = [];
                
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
                    console.log(elementos);
                    resolve(elementos);
                }
            })
        })
    },
    extraer_mes: () => {
        return new Promise((resolve,reject)=>{
            let elementos =[];
            base_de_datos.query(`SELECT DISTINCT (extract(month FROM fecha)) AS mes FROM monitoreo.Registro`,(err,data,filas)=>{
                if(err){
                    reject (new Error());
                }
                else{
                    for (let i = 0; i<data.length;i++){
                        elementos[i] = data[i].mes;
                    }
                    console.log(elementos);
                    resolve(elementos);
                }
            })
        })        
    },
    extraer_dia: (year,mes) => {
        return new Promise((resolve,reject)=>{
            let elementos = [];
            base_de_datos.query(`SELECT DISTINCT (extract(day FROM fecha)) AS dia FROM monitoreo.Registro WHERE fecha>= '${year}-${mes}-01' AND fecha<'${year}-${mes}-31';`,(err,data,otro)=>{
                if(err){
                    console.log(err);
                } else {
                    for(let i=0;i<data.length;i++){
                        elementos[i] = data[i].dia;
                    }
                    resolve(elementos);
                }
            });
        })
    }
    
}