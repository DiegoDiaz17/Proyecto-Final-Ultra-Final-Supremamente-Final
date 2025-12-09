export default class Cl_vCampaña {
    constructor(sistema, controlador) {
        this.campañaEnEdicion = null;
        this.sistema = sistema;
        this.controlador = controlador;
        this.inicializarEventos();
    }
    inicializarEventos() {
        const formCampaña = document.getElementById('formCampaña');
        formCampaña === null || formCampaña === void 0 ? void 0 : formCampaña.addEventListener('submit', (e) => {
            e.preventDefault();
            this.crearCampaña();
        });
        const formEditar = document.getElementById('formEditar');
        formEditar === null || formEditar === void 0 ? void 0 : formEditar.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarEdicion();
        });
    }
    establecerFechasMinimas(fechaMin) {
        const campFechaInicio = document.getElementById('campFechaInicio');
        const editFechaInicio = document.getElementById('editFechaInicio');
        if (campFechaInicio)
            campFechaInicio.min = fechaMin;
        if (editFechaInicio)
            editFechaInicio.min = fechaMin;
    }
    //agarra los datos 
    crearCampaña() {
        const datos = {
            nombre: document.getElementById('campNombre').value,
            descripcion: document.getElementById('campDescripcion').value,
            montoObjetivo: document.getElementById('campMontoObjetivo').value,
            fechaInicio: document.getElementById('campFechaInicio').value,
            fechaCierre: document.getElementById('campFechaCierre').value
        };
        const resultado = this.sistema.crearCampaña(datos);
        if (resultado.error) {
            this.controlador.mostrarAlerta(resultado.error, 'error', 'alertContainer2');
        }
        else {
            this.controlador.mostrarAlerta('✅ Campaña creada exitosamente', 'success', 'alertContainer2');
            setTimeout(() => this.controlador.irDashboard(), 1500);
        }
    }
    //editar campa;a
    guardarEdicion() {
        if (!this.campañaEnEdicion)
            return;
        const datos = {
            nombre: document.getElementById('editNombre').value,
            descripcion: document.getElementById('editDescripcion').value,
            montoObjetivo: document.getElementById('editMontoObjetivo').value,
            fechaInicio: document.getElementById('editFechaInicio').value,
            fechaCierre: document.getElementById('editFechaCierre').value
        };
        const resultado = this.sistema.editarCampaña(this.campañaEnEdicion.id, datos);
        if (resultado.error) {
            this.controlador.mostrarAlerta(resultado.error, 'error', 'alertContainer3');
        }
        else {
            this.controlador.mostrarAlerta('✅ Campaña actualizada', 'success', 'alertContainer3');
            setTimeout(() => this.controlador.irDetalleCampaña(), 1500);
        }
    }
    //actualizar la edicion
    cargarFormularioEdicion(campaña) {
        this.campañaEnEdicion = campaña;
        document.getElementById('editNombre').value = campaña.nombre;
        document.getElementById('editDescripcion').value = campaña.descripcion;
        document.getElementById('editMontoObjetivo').value =
            campaña.montoObjetivo.toString();
        document.getElementById('editFechaInicio').value =
            campaña.fechaInicio.toISOString().split('T')[0];
        document.getElementById('editFechaCierre').value =
            campaña.fechaCierre.toISOString().split('T')[0];
    }
    renderDetalleCampaña(id) {
        const campaña = this.sistema.obtenerCampaña(id);
        if (!campaña)
            return;
        this.campañaEnEdicion = campaña;
        const metricas = campaña.obtenerMetricas();
        document.getElementById('detalleNombre').textContent = campaña.nombre;
        document.getElementById('detalleObjetivo').textContent =
            '$' + campaña.montoObjetivo.toFixed(2);
        document.getElementById('detalleRecaudado').textContent =
            '$' + campaña.montoRecaudado.toFixed(2);
        document.getElementById('detallePorcentaje').textContent =
            metricas.porcentaje + '%';
        document.getElementById('detalleAportantes').textContent =
            metricas.aportantes.toString();
        const progressFill = document.getElementById('progressFill');
        const ancho = Math.min(parseFloat(metricas.porcentaje), 100);
        progressFill.style.width = ancho + '%';
        progressFill.textContent = metricas.porcentaje + '%';
        if (metricas.mayorAportante) {
            document.getElementById('mayorAportanteCedula').textContent =
                metricas.mayorAportante.cedula;
            document.getElementById('mayorAportanteMonto').textContent =
                '$' + metricas.mayorAportante.monto.toFixed(2);
        }
        else {
            document.getElementById('mayorAportanteCedula').textContent = 'N/A';
            document.getElementById('mayorAportanteMonto').textContent = '$0';
        }
        const tableAportes = document.getElementById('tableAportes');
        if (campaña.aportes.length === 0) {
            tableAportes.innerHTML =
                '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">Sin aportes registrados</td></tr>';
        }
        else {
            tableAportes.innerHTML = campaña.aportes
                .map(a => `
                <tr>
                    <td>${a.cedula}</td>
                    <td>${a.nombre}</td>
                    <td>$${a.monto.toFixed(2)}</td>
                    <td>${a.fecha.toLocaleDateString('es-ES')}</td>
                    <td>${a.referencia}</td>
                </tr>
            `)
                .join('');
        }
        const btnCerrar = document.getElementById('btnCerrarCampaña');
        const btnEditar = document.getElementById('btnEditarCampaña');
        if (campaña.estado === 'COMPLETADA' || campaña.estado === 'CERRADA') {
            btnCerrar.disabled = true;
            btnCerrar.style.opacity = '0.5';
            btnEditar.disabled = true;
            btnEditar.style.opacity = '0.5';
        }
        else {
            btnCerrar.disabled = false;
            btnCerrar.style.opacity = '1';
            btnEditar.disabled = campaña.aportes.length > 0;
            btnEditar.style.opacity = campaña.aportes.length > 0 ? '0.5' : '1';
        }
    }
    exportarReporte() {
        if (!this.campañaEnEdicion)
            return;
        const c = this.campañaEnEdicion;
        let reporte = 'REPORTE DE CAMPAÑA\n';
        reporte += '==================\n\n';
        reporte += `Nombre: ${c.nombre}\n`;
        reporte += `Descripción: ${c.descripcion}\n`;
        reporte += `Objetivo: $${c.montoObjetivo.toFixed(2)}\n`;
        reporte += `Recaudado: $${c.montoRecaudado.toFixed(2)}\n`;
        reporte += `Porcentaje: ${((c.montoRecaudado / c.montoObjetivo) *
            100).toFixed(2)}%\n`;
        reporte += `Estado: ${c.estado}\n\n`;
        reporte += 'APORTES REGISTRADOS\n';
        reporte += '-------------------\n';
        reporte += ' |Cédula | Nombre | Monto | Fecha | Referencia\n';
        c.aportes.forEach(a => {
            reporte += `${a.cedula} | ${a.nombre} | $${a.monto.toFixed(2)} | ${a.fecha.toLocaleDateString('es-ES')} | ${a.referencia}\n`;
        });
        const blob = new Blob([reporte], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_${c.nombre}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
