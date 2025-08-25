
function guardar() {
    var consecutivo = document.getElementById("numero").value;
    var pos = document.getElementById("posicion").value;
    
    localStorage.setItem("result",  (parseInt(consecutivo) - parseInt(pos))  );
    document.getElementById("numero").value = "";
    document.getElementById("posicion").value = "";
    document.getElementById("numero").focus();
}

function buscar() {
    var clave = document.getElementById("buscar_posicion").value;
     document.getElementById("resultado").innerHTML = parseInt(localStorage.getItem("result")) + parseInt(clave);
}

function reinicio() {
localStorage.setItem("result", 0);
document.getElementById("resultado").innerHTML = "0";
}