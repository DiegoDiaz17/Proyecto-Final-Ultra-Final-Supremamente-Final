import { formatearFecha } from './tools/index.js';

export interface IAporte {
    cedula: string;
    monto: number;
    fecha: Date;
    referencia: string;
}

export default class Cl_mAporte {
    private _cedula: string;
    private _monto: number;
    private _fecha: Date;
    private _referencia: string;

    constructor(cedula: string, monto: string | number, referencia: string) {
        this._cedula = cedula;
        this._monto = parseFloat(monto as string);
        this._fecha = new Date();
        this._referencia = referencia;
    }

    get cedula(): string {
        return this._cedula;
    }

    get monto(): number {
        return this._monto;
    }

    get fecha(): Date {
        return this._fecha;
    }

    get fechaFormato(): string {
        return formatearFecha(this._fecha);
    }
    get referencia(): string {
        return this._referencia;
    }

    toJSON(): IAporte {
        return {
            cedula: this._cedula,
            monto: this._monto,
            fecha: this._fecha,
            referencia: this._referencia,
        };
    }

    static fromJSON(obj: IAporte): Cl_mAporte {
        const aporte = new Cl_mAporte(obj.cedula, obj.monto, obj.referencia);
        aporte._fecha = new Date(obj.fecha as any);
        return aporte;
    }

    validar(): string | false {
        if (!this._cedula || this._cedula.trim() === '') {
            return 'La cédula es obligatoria.';
        }
        if (this._monto <= 0) {
            return 'El monto debe ser mayor a 0.';
        }
        if(!this._referencia || this._referencia.trim() === ''){
            return 'La referencia es obligatoria.';
        }
        if(this._referencia.length <= 5){
            return 'La referencia debe tener al menos 5 caracteres.';
        }
        return false;
    }
}
