import { Injectable } from '@angular/core';


export interface Documentos {
  name: string
  description: string
  status: number
  format: string //PDF - IMG - DOC ...
  required: number
  limit_mb: number //MB
  docwkf: number
  tipo: number
  idSub : number
  id: number
}



export interface Products {
  name: string
  description: string
  code: string
  Soe: SOE
  Sections: Section[]

}

export interface SOE {
  name: string
  description: string
  year: string
  code: string
  version: string
}

export interface Section {
  categoria : number
  Docs: Document[]
  
  Rules: Rule[]
  Conditions: Condition[]
}

export interface Rule {
  name: string
}



export interface Condition {
  name: string
}


export interface SeccionDocumentos {
  nombre: string
  documento: string
  seccion: string
}




@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

  constructor() { }
}
