if (navigator.serviceWorker){
 navigator.serviceWorker.register('sw.js');
}
setInterval(()=>{
  let clock = new Date();
  let reloj = document.getElementById('reloj');
  reloj.innerHTML = `Reloj: ${clock.getHours()}:${clock.getMinutes()}:${clock.getSeconds()}`
},1000)

/*
socket.on('temp',temp=>{
 console.log(temp)
})
*/

/*
function click(){
 navigator.serviceWorker.ready.then(regis=>{
  regis.showNotification(
 })
}
*/
