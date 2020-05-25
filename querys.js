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
                consolelog("Base de datos error: ",err);
            }
            for (let contador = 0; contador<token.length; contador++){
                tokens[contador] = token[contador].token;
            }
            return tokens;
        })
        return tokens;
    },
    insertar_valores: (temperatura, lugar) => {
        base_de_datos.query(`INSERT INTO monitoreo.Registro (registro, ubicacion, valor, fecha) VALUES (NULL, ${lugar}, ${temperatura}, CURRENT_TIMESTAMP)`)

    }
    
}