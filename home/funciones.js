//let years_in_data_base = document.createElement('option');
let year_options = document.getElementById('year');
let carga_year = document.getElementById('cargaYear');
let boton_envio_year = document.getElementById('botonYear');
let month_options = document.getElementById('month');
let carga_mes = document.getElementById('cargaMes');
let boton_envio_mes_year = document.getElementById('botonMesYear');

//let month_options; 
let day_options = document.getElementById('day'); 
let sensor_options;
let ids = ['year','month','day','sensor'];
let ip = '192.168.0.101';
let puerto = 5000;
let endpoint = '/consulta';
let endPoint_mes = '/mes';
let endPoint_dia = '/dia';

envioYear = () =>{
    carga_mes.style.visibility = 'visible';
    let year = {year: `${year_options.value}`};

    fetch(`http://${ip}:${puerto}${endPoint_mes}`,{
        method: 'POST',
        body: JSON.stringify(year),
        headers:{
            'Content-Type': 'application/json' 
        }
    }).then(response=>{
        carga_mes.style.visibility = 'collapse';
        return response.json();
    }).then(data=>{
        month_options.style.visibility = 'visible';
        carga_mes.style.visibility = 'collapse';
        data.forEach((element,id)=>{
            //console.log('Element: '+element);
            //console.log('id: '+id);
            let month_in_data_base = document.createElement('option');
            month_in_data_base.setAttribute('id',id);
            month_options.appendChild(month_in_data_base);
            month_in_data_base.innerHTML = element;
        })
        boton_envio_mes_year.style.visibility = 'visible';        
    })
}
envioMesYear = (mes,year) => {
    let info = {year: `${year_options.value}`,mes: `${month_options.value}`}
    console.log("Enviando data: ",info);
    fetch(`http://${ip}:${puerto}${endPoint_dia}`,{
            method: 'POST',
            body: JSON.stringify(info),
            headers:{
                'Content-Type': 'application/json' 
              },
        }).then(response=>{
            return response.json();
        }).then((data)=>{
            console.log(data)
            data.forEach((element,id)=>{
                let day_in_database = document.createElement('option');
                day_in_database.setAttribute('id',id);
                day_options.appendChild(day_in_database);
                day_in_database.innerHTML = element;
            })
            day_options.style.visibility = 'visible';
        }).catch( err => {
            console.log("Error: ",err);
        }).then(respuesta=>{
            console.log("Termindo!");
        })
}

fetch(`http://${ip}:${puerto}${endpoint}`).then(response => {
    //console.log(response);
    return response.json();
}).then((data => {
    year_options.style.visibility = 'visible';
    carga_year.style.visibility = 'collapse';
    boton_envio_year.style.visibility = 'visible';
    data.forEach((element,id)=>{
        let year_in_data_base = document.createElement('option');
        year_in_data_base.setAttribute(`id`,id);
        year_options.appendChild(year_in_data_base);
        year_in_data_base.innerHTML = null;
        year_in_data_base.innerHTML = year_in_data_base.innerHTML+element;
    })

})).catch(err=>{console.warn(err)});

asignacion_de_opciones = (elemento,indice,arr) => {
    let opcion_a_elegir = document.createElement('option');
    opcion_a_elegir.setAttribute('id','item');
    //`${ids[0]}`.appendChild()
}
//years_in_data_base.setAttribute('id',`${id}`);
//document.getElementById('year').appendChild(option);