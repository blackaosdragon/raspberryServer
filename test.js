const fetch = require('node-fetch');
const https = require('https');

console.log('Ejecutando fetch');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})

fetch('https://instrumentacionline.ddns.net/test',{
    method: 'GET',    
    headers:{
      'Content-Type': 'application/json' 
    },
    agent: httpsAgent
})
.then(response=>{
    return response.json()
}).then(data=>{
    console.log(data);
}).catch(error=>{
    console.log(error);
})

/*
const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    hostname: 'instrumentacionline.ddns.net',
    port: 443,
    path: '/test',
    method: 'GET',
    key: fs.readFileSync(path.resolve('E:\\Documentos\\GitHub\\raspberryServer\\certs\\private.key')),
    cert: fs.readFileSync(path.resolve('E:\\Documentos\\GitHub\\raspberryServer\\certs\\certificate.crt'))
}
/*


options.agent = new https.Agent(options);

const req = https.request(options, res => {
    console.log('statusCode: ',res.statusCode);
    res.on('data',data =>{
        process.stdout.write(data);
    });
});

req.on('error', e => {
    console.log(e);
})
req.end();
*/