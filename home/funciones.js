let years_in_data_base = document.createElement('option');
let id;
let ip = '192.168.0.101';
let puerto = 5001;
let endpoint = '/consulta'
fetch(`${ip}:${endpoint}${endpoint}`).then(response => {
    //console.log(response);
    return response.json();
}).then((data => {
    console.log(data);
}))
years_in_data_base.setAttribute('id',`${id}`);
//document.getElementById('year').appendChild(option);