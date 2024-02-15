import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrearDocumento, Documento, DocumentoDetalle } from 'src/app/services/wkfsolicitudes/interfaces.service';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';


export interface DialogData {
  animal: string;
  name: string;
}




@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  public ICrearDocumento: CrearDocumento = {
    nombre: '',
    telefono: '',
    cedula: '',
    correo: '',
    observacion: ''
  }

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IDocumentoDetalle: DocumentoDetalle = {
    wfdocumento: 0,
    privacidad: '',
    ncontrol: '',
    fcreacion: '',
    forigen: '',
    norigen: '',
    salida: '',
    tipo: '',
    remitente: '',
    unidad: '',
    comando: '',
    contenido: '',
    instrucciones: '',
    codigo: '',
    nexpediente: '',
    archivo: '',
    creador: ''
  }

  public IDocumento: Documento = {
    nombre: '',
    workflow: undefined,
    observacion: '',
    estado: undefined,
    estatus: undefined,
    usuario: ''
  }

  public nombre: string = 'Analista'
  public nombrecompleto: string = ''
  public analista: string = ''
  public cedula: string = ''
  public telefono: string = ''
  public correo: string = ''
  public perfil: string = ''
  animal: string;
  name: string;



  @ViewChild('cambiarClave', { static: true }) cambiarClave: TemplateRef<any>;
  // email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private loginService: LoginService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private apiService: ApiService,
  ) {


  }
  openDialog(): void {
    const dialogRef = this.dialog.open(this.cambiarClave, {
      width: '500px',
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }




  ngOnInit(): void {

    // console.log(this.loginService.Usuario)

    this.nombrecompleto = this.loginService.Usuario.nombre
    this.nombre = this.loginService.Usuario.usuario
    this.perfil = this.loginService.Usuario.Perfil.descripcion
    this.correo = this.loginService.Usuario.correo
    this.cedula = this.loginService.Usuario.cedula


  }


  open(content) {
    this.modalService.open(content, { size: 'lg' });

  }


  async guardarDocumento() {
    this.IDocumento.workflow = 18
    this.IDocumento.estado = 1
    this.IDocumento.estatus = 1
    this.IDocumento.usuario = this.loginService.Usuario.usuario
    this.IDocumento.nombre = this.ICrearDocumento.nombre
    this.IDocumento.observacion = this.ICrearDocumento.observacion
    this.xAPI.funcion = "WKF_IDocumento";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IDocumento)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        if (data.tipo == 1) {
          await this.CrearDocumentoDetalle(data.msj)
        } else {
          console.error(data)
        }
      },
      (error) => {
        console.log(error)
      }
    )

  }

  LimpiarDocumento() {
    this.ICrearDocumento = {
      nombre: '',
      telefono: '',
      cedula: '',
      correo: '',
      observacion: ''
    }
  }


  async CrearDocumentoDetalle(id: number) {
    this.IDocumentoDetalle.wfdocumento = id
    this.IDocumentoDetalle.fcreacion = '2024-02-14 21:16:42'
    this.IDocumentoDetalle.forigen = '2024-02-14 21:16:42'
    this.IDocumentoDetalle.tipo = this.ICrearDocumento.nombre
    this.IDocumentoDetalle.contenido = this.ICrearDocumento.observacion
    this.IDocumentoDetalle.creador = this.loginService.Usuario.usuario
    this.xAPI.funcion = "WKF_IDocumentoDetalle";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IDocumentoDetalle)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          console.log(data)
          this.apiService.Mensaje(
            "Felicitaciones, Proceso exitoso",
            "Codigo de documento #" + data.msj,
            "success",
            "documento"
          );
          this.LimpiarDocumento()

        } else {
          console.error(data)
          this.apiService.Mensaje(
            "Lo sentimos!, algo salio mal",
            "Codigo de documento #" + data.msj,
            "error",
            "documento"
          );
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


}


