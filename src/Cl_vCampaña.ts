import Cl_mCampaña from './Cl_mCampaña.js';
import Cl_mSistema from './Cl_mSistema.js';
import Cl_Controlador from './Cl_Controlador.js';

export default class Cl_vCampaña {
    private sistema: Cl_mSistema;
    private controlador: Cl_Controlador;
    campañaEnEdicion: Cl_mCampaña | null = null;

    constructor(sistema: Cl_mSistema, controlador: Cl_Controlador) {
        this.sistema = sistema;
        this.controlador = controlador;
        this.inicializarEventos();
    }

    private inicializarEventos(): void {
        const formCampaña = document.getElementById('formCampaña') as HTMLFormElement | null;
        formCampaña?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.crearCampaña();
        });

        const formEditar = document.getElementById('formEditar') as HTMLFormElement | null;
        formEditar?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarEdicion();
        });
    }

    establecerFechasMinimas(fechaMin: string): void {
        const campFechaInicio = document.getElementById('campFechaInicio') as HTMLInputElement | null;
        const editFechaInicio = document.getElementById('editFechaInicio') as HTMLInputElement | null;
        if (campFechaInicio) campFechaInicio.min = fechaMin;
        if (editFechaInicio) editFechaInicio.min = fechaMin;
    }
//agarra los datos 
    private crearCampaña(): void {
        const datos = {
            nombre: (document.getElementById('campNombre') as HTMLInputElement).value,
            descripcion: (document.getElementById('campDescripcion') as HTMLTextAreaElement).value,
            montoObjetivo: (document.getElementById('campMontoObjetivo') as HTMLInputElement).value,
            fechaInicio: (document.getElementById('campFechaInicio') as HTMLInputElement).value,
            fechaCierre: (document.getElementById('campFechaCierre') as HTMLInputElement).value
        };

        const resultado = this.sistema.crearCampaña(datos);

        if (resultado.error) {
            this.controlador.mostrarAlerta(resultado.error, 'error', 'alertContainer2');
        } else {
            this.controlador.mostrarAlerta(
                '✅ Campaña creada exitosamente',
                'success',
                'alertContainer2'
            );
            setTimeout(() => this.controlador.irDashboard(), 1500);
        }
    }
//editar campa;a
    private guardarEdicion(): void {
        if (!this.campañaEnEdicion) return;

        const datos = {
            nombre: (document.getElementById('editNombre') as HTMLInputElement).value,
            descripcion: (document.getElementById('editDescripcion') as HTMLTextAreaElement).value,
            montoObjetivo: (document.getElementById('editMontoObjetivo') as HTMLInputElement).value,
            fechaInicio: (document.getElementById('editFechaInicio') as HTMLInputElement).value,
            fechaCierre: (document.getElementById('editFechaCierre') as HTMLInputElement).value
        };

        const resultado = this.sistema.editarCampaña(this.campañaEnEdicion.id, datos);

        if (resultado.error) {
            this.controlador.mostrarAlerta(resultado.error, 'error', 'alertContainer3');
        } else {
            this.controlador.mostrarAlerta('✅ Campaña actualizada', 'success', 'alertContainer3');
            setTimeout(() => this.controlador.irDetalleCampaña(), 1500);
        }
    }
//actualizar la edicion
    cargarFormularioEdicion(campaña: Cl_mCampaña): void {
        this.campañaEnEdicion = campaña;
        (document.getElementById('editNombre') as HTMLInputElement).value = campaña.nombre;
        (document.getElementById('editDescripcion') as HTMLTextAreaElement).value = campaña.descripcion;
        (document.getElementById('editMontoObjetivo') as HTMLInputElement).value =
            campaña.montoObjetivo.toString();
        (document.getElementById('editFechaInicio') as HTMLInputElement).value =
            campaña.fechaInicio.toISOString().split('T')[0];
        (document.getElementById('editFechaCierre') as HTMLInputElement).value =
            campaña.fechaCierre.toISOString().split('T')[0];
    }

    renderDetalleCampaña(id: number): void {
        const campaña = this.sistema.obtenerCampaña(id);
        if (!campaña) return;

        this.campañaEnEdicion = campaña;
        const metricas = campaña.obtenerMetricas();

        (document.getElementById('detalleNombre') as HTMLElement).textContent = campaña.nombre;
        (document.getElementById('detalleObjetivo') as HTMLElement).textContent =
            '$' + campaña.montoObjetivo.toFixed(2);
        (document.getElementById('detalleRecaudado') as HTMLElement).textContent =
            '$' + campaña.montoRecaudado.toFixed(2);
        (document.getElementById('detallePorcentaje') as HTMLElement).textContent =
            metricas.porcentaje + '%';
        (document.getElementById('detalleAportantes') as HTMLElement).textContent =
            metricas.aportantes.toString();

        const progressFill = document.getElementById('progressFill') as HTMLDivElement;
        const ancho = Math.min(parseFloat(metricas.porcentaje), 100);
        progressFill.style.width = ancho + '%';
        progressFill.textContent = metricas.porcentaje + '%';

        if (metricas.mayorAportante) {
            (document.getElementById('mayorAportanteCedula') as HTMLElement).textContent =
                metricas.mayorAportante.cedula;
            (document.getElementById('mayorAportanteMonto') as HTMLElement).textContent =
                '$' + metricas.mayorAportante.monto.toFixed(2);
        } else {
            (document.getElementById('mayorAportanteCedula') as HTMLElement).textContent = 'N/A';
            (document.getElementById('mayorAportanteMonto') as HTMLElement).textContent = '$0';
        }

        const tableAportes = document.getElementById('tableAportes') as HTMLTableSectionElement;
        if (campaña.aportes.length === 0) {
            tableAportes.innerHTML =
                '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">Sin aportes registrados</td></tr>';
        } else {
            tableAportes.innerHTML = campaña.aportes
                .map(
                    a => `
                <tr>
                    <td>${a.cedula}</td>
                    <td>${a.nombre}</td>
                    <td>$${a.monto.toFixed(2)}</td>
                    <td>${a.fecha.toLocaleDateString('es-ES')}</td>
                    <td>${a.referencia}</td>
                </tr>
            `
                )
                .join('');
        }

        const btnCerrar = document.getElementById('btnCerrarCampaña') as HTMLButtonElement;
        const btnEditar = document.getElementById('btnEditarCampaña') as HTMLButtonElement;

        if (campaña.estado === 'COMPLETADA' || campaña.estado === 'CERRADA') {
            btnCerrar.disabled = true;
            btnCerrar.style.opacity = '0.5';
            btnEditar.disabled = true;
            btnEditar.style.opacity = '0.5';
        } else {
            btnCerrar.disabled = false;
            btnCerrar.style.opacity = '1';
            btnEditar.disabled = campaña.aportes.length > 0;
            btnEditar.style.opacity = campaña.aportes.length > 0 ? '0.5' : '1';
        }
    }

    exportarReporte(): void {
        if (!this.campañaEnEdicion) return;

        const c = this.campañaEnEdicion;
        let reporte = 'REPORTE DE CAMPAÑA\n';
        reporte += '==================\n\n';
        reporte += `Nombre: ${c.nombre}\n`;
        reporte += `Descripción: ${c.descripcion}\n`;
        reporte += `Objetivo: $${c.montoObjetivo.toFixed(2)}\n`;
        reporte += `Recaudado: $${c.montoRecaudado.toFixed(2)}\n`;
        reporte += `Porcentaje: ${(
            (c.montoRecaudado / c.montoObjetivo) *
            100
        ).toFixed(2)}%\n`;
        reporte += `Estado: ${c.estado}\n\n`;
        reporte += 'APORTES REGISTRADOS\n';
        reporte += '-------------------\n';
        reporte += ' |Cédula | Nombre | Monto | Fecha | Referencia\n';
        c.aportes.forEach(a => {
            reporte += `${a.cedula} | ${a.nombre} | $${a.monto.toFixed(
                2
            )} | ${a.fecha.toLocaleDateString('es-ES')} | ${a.referencia}\n`;
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
