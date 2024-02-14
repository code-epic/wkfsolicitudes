import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Documentos } from 'src/app/services/proceedings/administracion.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public Doc: Documentos = {
    name: '',
    description: '',
    status: 0,
    format: 'pdf',
    required: 0,
    limit_mb: 1,
    docwkf: 0,
    id: 0,
    idSub : 0,
    tipo: 0
  }

  public limit = "2"
  public required = "1"
  public status = "1"
  public tipo = "4"

  public lstDoc = []


  constructor(private apiService: ApiService, private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.listarDocs()
  }


  limpiar() {
    this.Doc = {
      name: '',
      description: '',
      status: 0,
      format: 'pdf',
      required: 0,
      limit_mb: 0,
      docwkf: 0,
      id: 0,
      idSub: 0,
      tipo: 0
    }
  }

  editar(e) {

  }

  getName(estatus: number): string {
    return estatus==1?'ACTIVO':'INACTIVO'
  }


  //listarDocs
  listarDocs() {
    this.ngxService.startLoader('loader-document')

    this.xAPI.funcion = 'PRC_CDocument'
    this.xAPI.valores = {}
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        this.lstDoc = data.Cuerpo
        await this.ngxService.stopLoader('loader-document')
      },
      err => {
        this.ngxService.stopLoader('loader-document')
        console.error(err)
      }
    )
  }

  guardar() {

    this.ngxService.startLoader('loader-document')

    this.Doc.required = parseInt(this.required);
    this.Doc.limit_mb = parseInt(this.limit)
    this.Doc.status = parseInt(this.status);
    this.Doc.tipo = parseInt(this.tipo);
    this.Doc.description = this.Doc.description.toUpperCase()
    this.Doc.name = this.Doc.name.toUpperCase()

   

    this.xAPI.funcion = 'PRC_IDocumento'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.Doc)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        
        await this.ngxService.stopLoader('loader-document')
        this.apiService.Mensaje(
          "Felicitaciones, Proceso exitoso",
          "Codigo de documento #" + data.msj,
          "success",
          "documento"
        );
        this.limpiar()
       
      },
      err => {
        console.error("Creo que algo no esta bien")
        this.ngxService.stopLoader('loader-document')
      }

    )
  }
}
