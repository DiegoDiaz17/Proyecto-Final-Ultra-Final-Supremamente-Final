import Cl_mSistema from './Cl_mSistema.js';
import Cl_vCampaña from './Cl_vCampaña.js';
import Cl_vSistema from './Cl_vSistema.js';
import Cl_vAporte from './Cl_vAporte.js';

export default class Cl_Controlador {
    sistema: Cl_mSistema;
    vCampaña: Cl_vCampaña;
    vSistema: Cl_vSistema;
    vAporte: Cl_vAporte;

    constructor() {
        this.sistema = new Cl_mSistema();
        this.vCampaña = new Cl_vCampaña(this.sistema, this);
        this.vSistema = new Cl_vSistema(this.sistema, this);
        this.vAporte = new Cl_vAporte(this);
        this.configurarFechas();
        this.irDashboard();
    }

    private configurarFechas(): void {
        // Usar fecha local en formato YYYY-MM-DD para evitar desfases por zona horaria
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = ('0' + (d.getMonth() + 1)).slice(-2);
        const dd = ('0' + d.getDate()).slice(-2);
        const hoy = `${yyyy}-${mm}-${dd}`;
        this.vCampaña.establecerFechasMinimas(hoy);
    }

    // Navegación
    private irSeccion(seccionId: string): void {
        document
            .querySelectorAll<HTMLElement>('.section')
            .forEach(s => s.classList.remove('active'));
        const seccion = document.getElementById(seccionId);
        if (seccion) seccion.classList.add('active');
    }

    irDashboard(): void {
        this.irSeccion('dashboard');
        this.vSistema.actualizarDashboard();
    }

    irCrearCampaña(): void {
        (document.getElementById('formCampaña') as HTMLFormElement).reset();
        this.irSeccion('crearCampaña');
    }

    irDetalleCampaña(id?: number): void {
        if (typeof id === 'number') {
            this.vCampaña.renderDetalleCampaña(id);
        }
        this.irSeccion('detalleCampaña');
    }

    irEditarCampaña(id?: number): void {
        if (typeof id === 'number') {
            const camp = this.sistema.obtenerCampaña(id);
            if (camp) this.vCampaña.cargarFormularioEdicion(camp);
        }
        this.irSeccion('editarCampaña');
    }

    irVistaParticipante(): void {
        this.vSistema.resetVistaParticipante();
        this.irSeccion('vistaParticipante');
    }

    seleccionarCampaña(): void {
        this.vSistema.seleccionarCampaña();
    }

    // Acciones globales
    exportarReporte(): void {
        this.vCampaña.exportarReporte();
    }

    mostrarModalCerrar(): void {
        (document.getElementById('modalCerrar') as HTMLDivElement).classList.add('active');
    }

    cerrarModal(): void {
        (document.getElementById('modalCerrar') as HTMLDivElement).classList.remove('active');
    }

    cerrarCampaña(): void {
        const camp = this.vCampaña.campañaEnEdicion;
        if (!camp) return;
        const res = this.sistema.cerrarCampaña(camp.id);
        this.cerrarModal();
        if (res.error) {
            this.mostrarAlerta(res.error, 'error');
        } else {
            this.mostrarAlerta('✅ Campaña cerrada', 'success');
            this.vCampaña.renderDetalleCampaña(camp.id);
            this.vSistema.actualizarDashboard();
        }
    }

    // Utilidades compartidas
    mostrarAlerta(
        msg: string,
        tipo: 'success' | 'error' | 'info' | 'warning',
        contenedor = 'alertContainer'
    ): void {
        const div = document.getElementById(contenedor) as HTMLDivElement | null;
        if (!div) return;
        div.innerHTML = `<div class="alert alert-${tipo}">${msg}</div>`;
        setTimeout(() => {
            div.innerHTML = '';
        }, 4000);
    }

    mostrarRecibo(cedula: string,nombre: string, monto: string, referencia: string, nombreCampaña: string): void {
        this.vAporte.mostrarRecibo(cedula, nombre, monto, referencia, nombreCampaña);
    }
}

// Para acceso desde HTML
declare global {
    interface Window {
        app: Cl_Controlador;
    }
}
