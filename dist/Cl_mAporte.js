import { formatearFecha } from './tools/index.js';
export default class Cl_mAporte {
    constructor(cedula, monto) {
        this._cedula = cedula;
        this._monto = parseFloat(monto);
        this._fecha = new Date();
    }
    get cedula() {
        return this._cedula;
    }
    get monto() {
        return this._monto;
    }
    get fecha() {
        return this._fecha;
    }
    get fechaFormato() {
        return formatearFecha(this._fecha);
    }
    toJSON() {
        return {
            cedula: this._cedula,
            monto: this._monto,
            fecha: this._fecha
        };
    }
    static fromJSON(obj) {
        const aporte = new Cl_mAporte(obj.cedula, obj.monto);
        aporte._fecha = new Date(obj.fecha);
        return aporte;
    }
    validar() {
        if (!this._cedula || this._cedula.trim() === '') {
            return 'La cédula es obligatoria.';
        }
        if (this._monto <= 0) {
            return 'El monto debe ser mayor a 0.';
        }
        return false;
    }
}
