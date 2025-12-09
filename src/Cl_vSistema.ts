import Cl_mSistema from './Cl_mSistema.js';
import Cl_Controlador from './Cl_Controlador.js';
import Cl_mCampaña from './Cl_mCampaña.js';

export default class Cl_vSistema {
    private sistema: Cl_mSistema;
    private controlador: Cl_Controlador;

    constructor(sistema: Cl_mSistema, controlador: Cl_Controlador) {
        this.sistema = sistema;
        this.controlador = controlador;
        this.inicializarEventos();
    }

    private inicializarEventos(): void {
        const formAporte = document.getElementById('formAporte') as HTMLFormElement | null;
        formAporte?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.registrarAporte();
        });
    }

    actualizarDashboard(): void {
        const resumen = this.sistema.obtenerResumen();
        (document.getElementById('statActivas') as HTMLElement).textContent =
            resumen.activas.toString();
        (document.getElementById('statCompletadas') as HTMLElement).textContent =
            resumen.completadas.toString();
        (document.getElementById('statTotalAportes') as HTMLElement).textContent =
            resumen.totalAportes.toString();
        (document.getElementById('statTotalRecaudado') as HTMLElement).textContent =
            '$' + resumen.totalRecaudado.toFixed(2);
        this.actualizarTablaCampañas();
    }

    private actualizarTablaCampañas(): void {
        const tabla = document.getElementById('tableCampanas') as HTMLTableSectionElement;
        const campañas = this.sistema.obtenerCampañas();

        if (campañas.length === 0) {
            tabla.innerHTML =
                '<tr><td colspan="6" style="text-align: center; color: var(--text-light);">No hay campañas registradas</td></tr>';
            return;
        }

        tabla.innerHTML = campañas
            .map(
                c => `
            <tr>
                <td><strong>${c.nombre}</strong></td>
                <td>$${c.montoObjetivo.toFixed(2)}</td>
                <td>$${c.montoRecaudado.toFixed(2)}</td>
                <td>${((c.montoRecaudado / c.montoObjetivo) * 100).toFixed(0)}%</td>
                <td>
                    <span class="badge ${
                        c.estado === 'ACTIVA'
                            ? 'badge-success'
                            : c.estado === 'COMPLETADA'
                            ? 'badge-info'
                            : 'badge-danger'
                    }">
                        ${c.estado}
                    </span>
                </td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn" title="Ver Detalle" onclick="window.app.irDetalleCampaña(${c.id})">👁️</button>
                        <button class="icon-btn ${c.aportes.length > 0 ? 'disabled' : ''}" 
                            title="${
                                c.aportes.length > 0
                                    ? 'No se puede editar con aportes'
                                    : 'Editar'
                            }"
                            onclick="window.app.irEditarCampaña(${c.id})" 
                            ${c.aportes.length > 0 ? 'disabled' : ''}>✏️</button>
                    </div>
                </td>
            </tr>
        `
            )
            .join('');
    }

    actualizarCampañasParticipante(): void {
        const select = document.getElementById('selectCampaña') as HTMLSelectElement;
        const campañasActivas = this.sistema.obtenerCampañasActivas();

        select.innerHTML =
            '<option value="">-- Seleccione una campaña --</option>' +
            campañasActivas
                .map(c => `<option value="${c.id}">${c.nombre}</option>`)
                .join('');
    }

    private registrarAporte(): void {
        const select = document.getElementById('selectCampaña') as HTMLSelectElement;
        const campañaId = select.value;
        const cedula = (document.getElementById('aporteCedula') as HTMLInputElement).value;
        const nombre = (document.getElementById('aporteNombre') as HTMLInputElement).value;
        const monto = (document.getElementById('aporteMonto') as HTMLInputElement).value;
        const referencia = (document.getElementById('aporteReferencia') as HTMLInputElement).value;
        const resultado = this.sistema.registrarAporte(campañaId, cedula,nombre, monto, referencia);

        if (resultado.error) {
            this.controlador.mostrarAlerta(resultado.error, 'error', 'alertContainer4');
        } else {
            const campaña = this.sistema.obtenerCampaña(campañaId) as Cl_mCampaña;
            this.controlador.mostrarRecibo(cedula,nombre, monto, referencia, campaña.nombre);
        }
    }

    resetVistaParticipante(): void {
        const select = document.getElementById('selectCampaña') as HTMLSelectElement;
        const formularioAporte = document.getElementById('formularioAporte') as HTMLDivElement;
        const recibo = document.getElementById('recibo') as HTMLDivElement;
        const formAporte = document.getElementById('formAporte') as HTMLFormElement;

        select.value = '';
        formularioAporte.style.display = 'none';
        recibo.style.display = 'none';
        formAporte.reset();
        this.actualizarCampañasParticipante();
    }

    seleccionarCampaña(): void {
        const select = document.getElementById('selectCampaña') as HTMLSelectElement;
        const formularioAporte = document.getElementById('formularioAporte') as HTMLDivElement;
        const recibo = document.getElementById('recibo') as HTMLDivElement;

        if (select.value) {
            const campaña = this.sistema.obtenerCampaña(select.value) as Cl_mCampaña;
            (document.getElementById('aporteNombreCampaña') as HTMLElement).textContent =
                campaña.nombre;
            formularioAporte.style.display = 'block';
            recibo.style.display = 'none';
            (document.getElementById('formAporte') as HTMLFormElement).reset();
        } else {
            formularioAporte.style.display = 'none';
        }
    }
}
