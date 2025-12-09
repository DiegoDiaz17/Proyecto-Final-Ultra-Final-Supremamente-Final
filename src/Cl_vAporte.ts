import Cl_mAporte from './Cl_mAporte.js';
import Cl_Controlador from './Cl_Controlador.js';

export default class Cl_vAporte {
    private controlador: Cl_Controlador;

    constructor(controlador: Cl_Controlador) {
        this.controlador = controlador;
    }
//muestra el recibo de cuando aporta
    mostrarRecibo(cedula: string, nombre: string, monto: string, referencia: string, nombreCampaña: string): void {
        (document.getElementById('reciboCedula') as HTMLElement).textContent = cedula;
        (document.getElementById('reciboNombre') as HTMLElement).textContent = nombre;
        (document.getElementById('reciboMonto') as HTMLElement).textContent =
            '$' + parseFloat(monto).toFixed(2);
        (document.getElementById('reciboReferencia') as HTMLElement).textContent = referencia;
        (document.getElementById('reciboCampaña') as HTMLElement).textContent = nombreCampaña;
        (document.getElementById('reciboFecha') as HTMLElement).textContent =
            new Date().toLocaleDateString('es-ES');

        const formularioAporte = document.getElementById('formularioAporte') as HTMLDivElement;
        const recibo = document.getElementById('recibo') as HTMLDivElement;
        formularioAporte.style.display = 'none';
        recibo.style.display = 'block';
        (document.getElementById('selectCampaña') as HTMLSelectElement).value = '';
    }
//lo resetea
    resetFormulario(): void {
        (document.getElementById('formAporte') as HTMLFormElement).reset();
    }
}
