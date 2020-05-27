let years_in_data_base = document.createElement('option');
let id;
fetch('192.168.0.101/consulta').then(response => {
    console.log(response);
    return response.json();
}).then((data => {
    console.log(data);
}))
years_in_data_base.setAttribute('id',`${id}`);
//document.getElementById('year').appendChild(option);