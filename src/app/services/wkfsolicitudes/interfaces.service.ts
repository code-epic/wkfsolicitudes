import { Injectable } from '@angular/core';



export interface CrearDocumento {
    nombre: string
    telefono: string
    cedula: string
    correo: string
    observacion: string
}


export interface DocumentoDetalle {
    wfdocumento: number
    privacidad: string
    ncontrol: string
    fcreacion: string
    forigen: string
    norigen: string
    salida: string
    tipo: string
    remitente: string
    unidad: string
    comando: string
    contenido: string
    instrucciones: string
    codigo: string
    nexpediente: string
    archivo: string
    creador: string
}

export interface Documento {
    nombre: string
    workflow: number
    observacion: string
    estado: number
    estatus: number
    usuario: string
}



@Injectable({
    providedIn: 'root'
})
export class InterfacesService {

    constructor() { }
}
