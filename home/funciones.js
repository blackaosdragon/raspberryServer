//let years_in_data_base = document.createElement('option');
let year_options = document.getElementById('year');
let month_options; 
let day_options; 
let sensor_options;
let ids = ['year','month','day','sensor'];
let ip = '192.168.0.101';
let puerto = 5000;
let endpoint = '/consulta'
fetch(`http://${ip}:${puerto}${endpoint}`).then(response => {
    console.log(response);
    return response.json();
}).then((data => {
    console.log(data[0]);
    //years_in_data_base.setAttribute(`${id}`,`name`)
    
    year_options.style.visibility = 'visible';
    data.forEach((element,id)=>{
        let year_in_data_base = document.createElement('option');
        year_in_data_base.setAttribute(`id`,'item');
        year_options.appendChild(year_in_data_base);
        year_in_data_base.innerHTML = year_in_data_base.innerHTML+element;
    })

}))
asignacion_de_opciones = (elemento,indice,arr) => {
    let opcion_a_elegir = document.createElement('option');
    opcion_a_elegir.setAttribute('id','item');
    //`${ids[0]}`.appendChild()
}
//years_in_data_base.setAttribute('id',`${id}`);
//document.getElementById('year').appendChild(option);