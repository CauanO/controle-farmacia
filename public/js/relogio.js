function AtualizarHora() {
    let hora = new Date();
    hr  = hora.getHours();
    min  = hora.getMinutes();
    seg = hora.getSeconds();
  
    if(hr < 10){hr = "0" + hr}
    if(min < 10){min = "0" + min}
    if(seg < 10){seg = "0" + seg}
  
    document.getElementById("hora").innerHTML = hr;
    document.getElementById("minuto").innerHTML = min;
    document.getElementById("segundo").innerHTML = seg;
  }
  
  setInterval(AtualizarHora, 1000);
  
  function AtualizarData() {
    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let ano = data.getFullYear();
  
    if(dia < 10){dia = "0" + dia}
    if(mes < 10){mes = "0" + mes}
  
  
    document.getElementById("dia").innerHTML = dia;
    document.getElementById("mes").innerHTML = mes;
    document.getElementById("ano").innerHTML = ano;
  }
  
  setInterval(AtualizarData, 1000);
  