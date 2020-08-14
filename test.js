const fetch = require('node-fetch');

console.log('Ejecutando fetch');

fetch('https://instrumentacionline.ddns.net/test')
.then(response=>{
    return response.json()
}).then(data=>{
    console.log(data);
}).catch(error=>{
    console.log(error);
})