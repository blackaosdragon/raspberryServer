//let years_in_data_base = document.createElement('option');
let year_options = document.getElementById('year');
let month_options = document.getElementById('month');
//let month_options; 
let day_options; 
let sensor_options;
let ids = ['year','month','day','sensor'];
let ip = '192.168.0.101';
let puerto = 5000;
let endpoint = '/consulta';
let endPoint_mes = '/mes';
let endPoint_dia = '/dia';

fetch(`http://${ip}:${puerto}${endpoint}`).then(response => {
    //console.log(response);
    return response.json();
}).then((data => {
    //console.log(data[0]);
    //years_in_data_base.setAttribute(`${id}`,`name`)
    
    year_options.style.visibility = 'visible';
    data.forEach((element,id)=>{
        let year_in_data_base = document.createElement('option');
        year_in_data_base.setAttribute(`id`,id);
        year_options.appendChild(year_in_data_base);
        year_in_data_base.innerHTML = year_in_data_base.innerHTML+element;
    })

})).then(
    fetch(`http://${ip}:${puerto}${endPoint_mes}`).then(response=>{
        //console.log(response);
        return response.json();
    }).then(data=>{
        //console.log(data);
        month_options.style.visibility = 'visible';
        data.forEach((element,id)=>{
            //console.log('Element: '+element);
            //console.log('id: '+id);
            let month_in_data_base = document.createElement('option');
            month_in_data_base.setAttribute('id',id);
            month_options.appendChild(month_in_data_base);
            month_in_data_base.innerHTML = element;
        })
        console.log(`Values: Year: ${year_options.value} Month: ${month_options.value}`)
        let info = {
            year: `${year_options.value}`,
            mes: `${month_options.value}`
        }
        
        fetch(`http://${ip}:${puerto}${endPoint_dia}`,{
            method: 'POST',
            body: JSON.stringify(info),
            headers:{
                'Content-Type': 'application/json' 
              }
        }).then(res=>res.json()).catch( err => {
            console.log("Error: ",err);
        })
        
    })

)
asignacion_de_opciones = (elemento,indice,arr) => {
    let opcion_a_elegir = document.createElement('option');
    opcion_a_elegir.setAttribute('id','item');
    //`${ids[0]}`.appendChild()
}
//years_in_data_base.setAttribute('id',`${id}`);
//document.getElementById('year').appendChild(option);