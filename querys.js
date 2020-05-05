const mySql = require ('mysql');
const base_de_datos = mySql.createConnection({
    host: 'localhost',
    user: 'infoUpdater',
    password: '107005205',
    database: 'tokens'
})
module.exports = {
    asignar_tokens: () => {
        let tokens = [];
        base_de_datos.query("SELECT * FROM Tokens", (err, token, campos)=>{
            if(err){
                consolelog("Base de datos error: ",err);
            }
            for (let contador = 0; contador<token.length; contador++){
                tokens[contador] = token[contador].token;
            }
            return tokens;
        })
        return tokens;
    }
}