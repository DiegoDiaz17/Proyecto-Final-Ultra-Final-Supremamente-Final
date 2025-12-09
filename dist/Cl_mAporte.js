import { formatearFecha } from './tools/index.js';
export default class Cl_mAporte {
    constructor(cedula, nombre, monto, referencia) {
        this._cedula = cedula;
        this._nombre = nombre;
        this._monto = parseFloat(monto);
        this._fecha = new Date();
        this._referencia = referencia;
    }
    get cedula() {
        return this._cedula;
    }
    get nombre() {
        return this._nombre;
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
    get referencia() {
        return this._referencia;
    }
    toJSON() {
        return {
            cedula: this._cedula,
            nombre: this._nombre,
            monto: this._monto,
            fecha: this._fecha.toISOString(),
            referencia: this._referencia,
        };
    }
    //acuerdense de poner los atributos nuevos aca
    static fromJSON(obj) {
        const aporte = new Cl_mAporte(obj.cedula, obj.nombre, obj.monto, obj.referencia);
        aporte._fecha = new Date(obj.fecha);
        return aporte;
    }
    // validar si los aportes son correctos
    validar() {
        if (!this._cedula || this._cedula.trim() === '') {
            return 'La cédula es obligatoria.';
        }
        if (!this._nombre || this._nombre.trim() === '') {
            return 'El nombre es obligatorio.';
        }
        if (this._monto <= 0) {
            return 'El monto debe ser mayor a 0.';
        }
        if (!this._referencia || this._referencia.trim() === '') {
            return 'La referencia es obligatoria.';
        }
        if (this._referencia.length <= 5) {
            return 'La referencia debe tener al menos 5 caracteres.';
        }
        return false;
    }
}
