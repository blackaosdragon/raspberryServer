let years_in_data_base = document.createElement('option');
let id;
let ip = '192.168.0.101';
let puerto = 5000;
let endpoint = '/consulta'
fetch(`http://${ip}:${puerto}${endpoint}`).then(response => {
    console.log(response);
    return response.json();
}).then((data => {
    console.log(data);
}))
//years_in_data_base.setAttribute('id',`${id}`);
//document.getElementById('year').appendChild(option);