import { formatearFecha } from './tools/index.js';

export interface IAporte {
    cedula: string;
    monto: number;
    fecha: Date;
}

export default class Cl_mAporte {
    private _cedula: string;
    private _monto: number;
    private _fecha: Date;

    constructor(cedula: string, monto: string | number) {
        this._cedula = cedula;
        this._monto = parseFloat(monto as string);
        this._fecha = new Date();
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

    toJSON(): IAporte {
        return {
            cedula: this._cedula,
            monto: this._monto,
            fecha: this._fecha
        };
    }

    static fromJSON(obj: IAporte): Cl_mAporte {
        const aporte = new Cl_mAporte(obj.cedula, obj.monto);
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
        return false;
    }
}
