import { formatearFecha } from './tools/index.js';
import Cl_mAporte, { IAporte } from './Cl_mAporte.js';

export interface ICampaña {
    id: number;
    nombre: string;
    descripcion: string;
    montoObjetivo: number;
    montoRecaudado: number;
    estado: 'ACTIVA' | 'COMPLETADA' | 'CERRADA';
    fechaInicio: Date | string;
    fechaCierre: Date | string;
    aportes: IAporte[];
}

export default class Cl_mCampaña {
    private _id: number;
    private _nombre: string;
    private _descripcion: string;
    private _montoObjetivo: number;
    private _montoRecaudado: number;
    private _estado: 'ACTIVA' | 'COMPLETADA' | 'CERRADA';
    private _fechaInicio: Date;
    private _fechaCierre: Date;
    private _aportes: Cl_mAporte[];

    constructor(datos: {
        nombre: string;
        descripcion: string;
        montoObjetivo: string | number;
        fechaInicio: string;
        fechaCierre: string;
    }) {
        this._id = Date.now();
        this._nombre = datos.nombre;
        this._descripcion = datos.descripcion;
        this._montoObjetivo = parseFloat(datos.montoObjetivo as string);
        this._montoRecaudado = 0;
        this._estado = 'ACTIVA';
        this._fechaInicio = new Date(datos.fechaInicio);
        this._fechaCierre = new Date(datos.fechaCierre);
        this._aportes = [];
    }

    // Getters
    get id(): number {
        return this._id;
    }

    get nombre(): string {
        return this._nombre;
    }

    get descripcion(): string {
        return this._descripcion;
    }

    get montoObjetivo(): number {
        return this._montoObjetivo;
    }

    get montoRecaudado(): number {
        return this._montoRecaudado;
    }

    get estado(): 'ACTIVA' | 'COMPLETADA' | 'CERRADA' {
        return this._estado;
    }

    get fechaInicio(): Date {
        return this._fechaInicio;
    }

    get fechaCierre(): Date {
        return this._fechaCierre;
    }

    get aportes(): Cl_mAporte[] {
        return this._aportes;
    }

    // Setters
    set nombre(nombre: string) {
        this._nombre = nombre;
    }

    set descripcion(descripcion: string) {
        this._descripcion = descripcion;
    }

    set montoObjetivo(monto: number | string) {
        this._montoObjetivo = parseFloat(monto as string);
    }

    set fechaInicio(fecha: Date | string) {
        this._fechaInicio = typeof fecha === 'string' ? new Date(fecha) : fecha;
    }

    set fechaCierre(fecha: Date | string) {
        this._fechaCierre = typeof fecha === 'string' ? new Date(fecha) : fecha;
    }

    set estado(estado: 'ACTIVA' | 'COMPLETADA' | 'CERRADA') {
        this._estado = estado;
    }

    // Métodos
    //aca se agregan los aportes
    agregarAporte(aporte: Cl_mAporte): void {
        this._aportes.push(aporte);
        //se guardan los aportes al monto
        this._montoRecaudado += aporte.monto;
        this.verificarComplecion();
    }
// verifica si ya se llego al monto 
    private verificarComplecion(): void {
        if (this._montoRecaudado >= this._montoObjetivo) {
            this._estado = 'COMPLETADA';
        }
    }
// verifica si la campa;a esta activa
    estaActiva(): boolean {
        const hoy = new Date();
        return (
            this._estado === 'ACTIVA' &&
            hoy >= this._fechaInicio &&
            hoy <= this._fechaCierre
        );
    }

    obtenerMetricas(): {
        porcentaje: string;
        mayorAportante: IAporte | null;
        aportantes: number;
    } {
        // porcentaje monto objetivo
        const porcentaje =
            this._montoObjetivo > 0
                ? ((this._montoRecaudado / this._montoObjetivo) * 100).toFixed(2)
                : '0.00';
// quien a aportado mas
        const mayorAportante =
            this._aportes.length > 0
                ? this._aportes.reduce((prev, current) =>
                      prev.monto > current.monto ? prev : current
                  )
                : null;

        return {
            porcentaje,
            mayorAportante,
            aportantes: this._aportes.length
        };
    }
//validar si la campana esta bien 
    validar(): string | false {
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

    toJSON(): ICampaña {
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

    static fromJSON(obj: any): Cl_mCampaña {
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
        camp._aportes = (obj.aportes || []).map((a: any) => Cl_mAporte.fromJSON(a));
        return camp;
    }
}
