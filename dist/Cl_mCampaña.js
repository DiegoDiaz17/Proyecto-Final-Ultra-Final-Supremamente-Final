import Cl_mAporte from './Cl_mAporte.js';
export default class Cl_mCampaña {
    constructor(datos) {
        this._id = Date.now();
        this._nombre = datos.nombre;
        this._descripcion = datos.descripcion;
        this._montoObjetivo = parseFloat(datos.montoObjetivo);
        this._montoRecaudado = 0;
        this._estado = 'ACTIVA';
        this._fechaInicio = new Date(datos.fechaInicio);
        this._fechaCierre = new Date(datos.fechaCierre);
        this._aportes = [];
    }
    // Getters
    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    get descripcion() {
        return this._descripcion;
    }
    get montoObjetivo() {
        return this._montoObjetivo;
    }
    get montoRecaudado() {
        return this._montoRecaudado;
    }
    get estado() {
        return this._estado;
    }
    get fechaInicio() {
        return this._fechaInicio;
    }
    get fechaCierre() {
        return this._fechaCierre;
    }
    get aportes() {
        return this._aportes;
    }
    // Setters
    set nombre(nombre) {
        this._nombre = nombre;
    }
    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }
    set montoObjetivo(monto) {
        this._montoObjetivo = parseFloat(monto);
    }
    set fechaInicio(fecha) {
        this._fechaInicio = typeof fecha === 'string' ? new Date(fecha) : fecha;
    }
    set fechaCierre(fecha) {
        this._fechaCierre = typeof fecha === 'string' ? new Date(fecha) : fecha;
    }
    set estado(estado) {
        this._estado = estado;
    }
    // Métodos
    //aca se agregan los aportes
    agregarAporte(aporte) {
        this._aportes.push(aporte);
        //se guardan los aportes al monto
        this._montoRecaudado += aporte.monto;
        this.verificarComplecion();
    }
    // verifica si ya se llego al monto 
    verificarComplecion() {
        if (this._montoRecaudado >= this._montoObjetivo) {
            this._estado = 'COMPLETADA';
        }
    }
    // verifica si la campa;a esta activa
    estaActiva() {
        const hoy = new Date();
        return (this._estado === 'ACTIVA' &&
            hoy >= this._fechaInicio &&
            hoy <= this._fechaCierre);
    }
    obtenerMetricas() {
        // porcentaje monto objetivo
        const porcentaje = this._montoObjetivo > 0
            ? ((this._montoRecaudado / this._montoObjetivo) * 100).toFixed(2)
            : '0.00';
        // quien a aportado mas
        const mayorAportante = this._aportes.length > 0
            ? this._aportes.reduce((prev, current) => prev.monto > current.monto ? prev : current)
            : null;
        return {
            porcentaje,
            mayorAportante,
            aportantes: this._aportes.length
        };
    }
    //validar si la campana esta bien 
    validar() {
        if (!this._nombre || this._nombre.trim() === '') {
            return 'El nombre es obligatorio.';
        }
        if (!this._descripcion || this._descripcion.trim() === '') {
            return 'La descripción es obligatoria.';
        }
        if (this._montoObjetivo <= 0) {
            return 'El monto debe ser mayor a 0.';
        }
        if (this._fechaCierre <= this._fechaInicio) {
            return 'La fecha de cierre debe ser posterior a la de inicio.';
        }
        return false;
    }
    toJSON() {
        return {
            id: this._id,
            nombre: this._nombre,
            descripcion: this._descripcion,
            montoObjetivo: this._montoObjetivo,
            montoRecaudado: this._montoRecaudado,
            estado: this._estado,
            fechaInicio: this._fechaInicio.toISOString(),
            fechaCierre: this._fechaCierre.toISOString(),
            aportes: this._aportes.map(a => a.toJSON())
        };
    }
    static fromJSON(obj) {
        const datos = {
            nombre: obj.nombre,
            descripcion: obj.descripcion,
            montoObjetivo: obj.montoObjetivo,
            fechaInicio: obj.fechaInicio,
            fechaCierre: obj.fechaCierre
        };
        const camp = new Cl_mCampaña(datos);
        camp._id = Number(obj.id);
        camp._montoRecaudado = Number(obj.montoRecaudado) || 0;
        camp._estado = obj.estado || 'ACTIVA';
        camp._aportes = (obj.aportes || []).map((a) => Cl_mAporte.fromJSON(a));
        return camp;
    }
}
