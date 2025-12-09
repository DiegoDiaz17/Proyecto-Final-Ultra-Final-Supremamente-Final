import Cl_mCampaña from './Cl_mCampaña.js';
import Cl_mAporte from './Cl_mAporte.js';
import storage from './tools/storage.js';
class Cl_mSistema {
    constructor() {
        this._campañas = [];
        // Intentar cargar estado desde localStorage
        try {
            const raw = storage.get(Cl_mSistema.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    this._campañas = parsed.map((c) => Cl_mCampaña.fromJSON(c));
                }
            }
        }
        catch (e) {
            this._campañas = [];
        }
    }
    guardar() {
        try {
            const data = this._campañas.map(c => c.toJSON());
            storage.set(Cl_mSistema.STORAGE_KEY, JSON.stringify(data));
        }
        catch (e) {
            // Silenciar errores de almacenamiento (por ejemplo, entorno sin localStorage)
        }
    }
    crearCampaña(datos) {
        const campaña = new Cl_mCampaña(datos);
        const error = campaña.validar();
        if (error) {
            return { error };
        }
        const inicio = new Date(datos.fechaInicio);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        this._campañas.push(campaña);
        this.guardar();
        return { success: true, campaña };
    }
    obtenerResumen() {
        const activas = this._campañas.filter(c => c.estado === 'ACTIVA').length;
        const completadas = this._campañas.filter(c => c.estado === 'COMPLETADA').length;
        const totalAportes = this._campañas.reduce((sum, c) => sum + c.aportes.length, 0);
        const totalRecaudado = this._campañas.reduce((sum, c) => sum + c.montoRecaudado, 0);
        return { activas, completadas, totalAportes, totalRecaudado };
    }
    obtenerCampaña(id) {
        return this._campañas.find(c => c.id === Number(id));
    }
    obtenerCampañas() {
        return this._campañas;
    }
    obtenerCampañasActivas() {
        return this._campañas.filter(c => c.estaActiva());
    }
    editarCampaña(id, datos) {
        const campaña = this.obtenerCampaña(id);
        if (!campaña)
            return { error: 'Campaña no encontrada.' };
        if (campaña.aportes.length > 0) {
            return { error: 'No se puede editar una campaña con fondos ya recaudados.' };
        }
        campaña.nombre = datos.nombre;
        campaña.descripcion = datos.descripcion;
        campaña.montoObjetivo = datos.montoObjetivo;
        campaña.fechaInicio = datos.fechaInicio;
        campaña.fechaCierre = datos.fechaCierre;
        const error = campaña.validar();
        if (error) {
            return { error };
        }
        return { success: true };
    }
    cerrarCampaña(id) {
        const campaña = this.obtenerCampaña(id);
        if (!campaña)
            return { error: 'Campaña no encontrada.' };
        if (campaña.estado === 'COMPLETADA' || campaña.estado === 'CERRADA') {
            return { error: 'Esta campaña ya está cerrada.' };
        }
        campaña.estado = 'CERRADA';
        this.guardar();
        return { success: true };
    }
    registrarAporte(campañaId, cedula, nombre, monto, referencia) {
        const campaña = this.obtenerCampaña(campañaId);
        if (!campaña)
            return { error: 'Campaña no encontrada.' };
        if (!campaña.estaActiva()) {
            return { error: 'Esta campaña ya no acepta aportes.' };
        }
        const aporte = new Cl_mAporte(cedula, nombre, monto, referencia);
        const error = aporte.validar();
        if (error) {
            return { error };
        }
        campaña.agregarAporte(aporte);
        this.guardar();
        return { success: true };
    }
}
Cl_mSistema.STORAGE_KEY = 'gestion_donaciones_data_v1';
export default Cl_mSistema;
