import { formatearFecha } from './tools/index.js';

export interface IAporte {
    cedula: string;
    nombre: string;
    monto: number;
    fecha: Date | string;
    referencia: string;
    
}

export default class Cl_mAporte {
    private _cedula: string;
    private _nombre: string;
    private _monto: number;
    private _fecha: Date;
    private _referencia: string;
    

    constructor(cedula: string, nombre: string, monto: string | number, referencia: string) {
        this._cedula = cedula;
        this._nombre = nombre;
        this._monto = parseFloat(monto as string);
        this._fecha = new Date();
        this._referencia = referencia;
    }

    get cedula(): string {
        return this._cedula;
    }

 get nombre(): string {
        return this._nombre;
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
            nombre: this._nombre,   
            monto: this._monto,
            fecha: this._fecha.toISOString(),
            referencia: this._referencia,
        };
    }


    //acuerdense de poner los atributos nuevos aca
    static fromJSON(obj: IAporte): Cl_mAporte {
        const aporte = new Cl_mAporte(obj.cedula, obj.nombre, obj.monto, obj.referencia);
        aporte._fecha = new Date(obj.fecha as any);
        return aporte;
    }
// validar si los aportes son correctos
    validar(): string | false {
        if (!this._cedula || this._cedula.trim() === '') {
            return 'La cédula es obligatoria.';
        }
        if (!this._nombre || this._nombre.trim() === '') {
            return 'El nombre es obligatorio.';
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
