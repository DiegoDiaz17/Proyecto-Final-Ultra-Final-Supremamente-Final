export default class Cl_vSistema {
    constructor(sistema, controlador) {
        this.sistema = sistema;
        this.controlador = controlador;
        this.inicializarEventos();
    }
    inicializarEventos() {
        const formAporte = document.getElementById('formAporte');
        formAporte === null || formAporte === void 0 ? void 0 : formAporte.addEventListener('submit', (e) => {
            e.preventDefault();
            this.registrarAporte();
        });
    }
    actualizarDashboard() {
        const resumen = this.sistema.obtenerResumen();
        document.getElementById('statActivas').textContent =
            resumen.activas.toString();
        document.getElementById('statCompletadas').textContent =
            resumen.completadas.toString();
        document.getElementById('statTotalAportes').textContent =
            resumen.totalAportes.toString();
        document.getElementById('statTotalRecaudado').textContent =
            '$' + resumen.totalRecaudado.toFixed(2);
        this.actualizarTablaCampañas();
    }
    actualizarTablaCampañas() {
        const tabla = document.getElementById('tableCampanas');
        const campañas = this.sistema.obtenerCampañas();
        if (campañas.length === 0) {
            tabla.innerHTML =
                '<tr><td colspan="6" style="text-align: center; color: var(--text-light);">No hay campañas registradas</td></tr>';
            return;
        }
        tabla.innerHTML = campañas
            .map(c => `
            <tr>
                <td><strong>${c.nombre}</strong></td>
                <td>$${c.montoObjetivo.toFixed(2)}</td>
                <td>$${c.montoRecaudado.toFixed(2)}</td>
                <td>${((c.montoRecaudado / c.montoObjetivo) * 100).toFixed(0)}%</td>
                <td>
                    <span class="badge ${c.estado === 'ACTIVA'
            ? 'badge-success'
            : c.estado === 'COMPLETADA'
                ? 'badge-info'
                : 'badge-danger'}">
                        ${c.estado}
                    </span>
                </td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn" title="Ver Detalle" onclick="window.app.irDetalleCampaña(${c.id})">👁️</button>
                        <button class="icon-btn ${c.aportes.length > 0 ? 'disabled' : ''}" 
                            title="${c.aportes.length > 0
            ? 'No se puede editar con aportes'
            : 'Editar'}"
                            onclick="window.app.irEditarCampaña(${c.id})" 
                            ${c.aportes.length > 0 ? 'disabled' : ''}>✏️</button>
                    </div>
                </td>
            </tr>
        `)
            .join('');
    }
    actualizarCampañasParticipante() {
        const select = document.getElementById('selectCampaña');
        const campañasActivas = this.sistema.obtenerCampañasActivas();
        select.innerHTML =
            '<option value="">-- Seleccione una campaña --</option>' +
                campañasActivas
                    .map(c => `<option value="${c.id}">${c.nombre}</option>`)
                    .join('');
    }
    registrarAporte() {
        const select = document.getElementById('selectCampaña');
        const campañaId = select.value;
        const cedula = document.getElementById('aporteCedula').value;
        const nombre = document.getElementById('aporteNombre').value;
        const monto = document.getElementById('aporteMonto').value;
        const referencia = document.getElementById('aporteReferencia').value;
        const resultado = this.sistema.registrarAporte(campañaId, cedula, nombre, monto, referencia);
        if (resultado.error) {
            this.controlador.mostrarAlerta(resultado.error, 'error', 'alertContainer4');
        }
        else {
            const campaña = this.sistema.obtenerCampaña(campañaId);
            this.controlador.mostrarRecibo(cedula, nombre, monto, referencia, campaña.nombre);
        }
    }
    resetVistaParticipante() {
        const select = document.getElementById('selectCampaña');
        const formularioAporte = document.getElementById('formularioAporte');
        const recibo = document.getElementById('recibo');
        const formAporte = document.getElementById('formAporte');
        select.value = '';
        formularioAporte.style.display = 'none';
        recibo.style.display = 'none';
        formAporte.reset();
        this.actualizarCampañasParticipante();
    }
    seleccionarCampaña() {
        const select = document.getElementById('selectCampaña');
        const formularioAporte = document.getElementById('formularioAporte');
        const recibo = document.getElementById('recibo');
        if (select.value) {
            const campaña = this.sistema.obtenerCampaña(select.value);
            document.getElementById('aporteNombreCampaña').textContent =
                campaña.nombre;
            formularioAporte.style.display = 'block';
            recibo.style.display = 'none';
            document.getElementById('formAporte').reset();
        }
        else {
            formularioAporte.style.display = 'none';
        }
    }
}
