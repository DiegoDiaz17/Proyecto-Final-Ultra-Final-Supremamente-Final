export default class Cl_vAporte {
    constructor(controlador) {
        this.controlador = controlador;
    }
    //muestra el recibo de cuando aporta
    mostrarRecibo(cedula, nombre, monto, referencia, nombreCampaña) {
        document.getElementById('reciboCedula').textContent = cedula;
        document.getElementById('reciboNombre').textContent = nombre;
        document.getElementById('reciboMonto').textContent =
            '$' + parseFloat(monto).toFixed(2);
        document.getElementById('reciboReferencia').textContent = referencia;
        document.getElementById('reciboCampaña').textContent = nombreCampaña;
        document.getElementById('reciboFecha').textContent =
            new Date().toLocaleDateString('es-ES');
        const formularioAporte = document.getElementById('formularioAporte');
        const recibo = document.getElementById('recibo');
        formularioAporte.style.display = 'none';
        recibo.style.display = 'block';
        document.getElementById('selectCampaña').value = '';
    }
    //lo resetea
    resetFormulario() {
        document.getElementById('formAporte').reset();
    }
}
