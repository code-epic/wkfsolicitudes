import {
  Component,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { ApiService, IAPICore } from "src/app/services/apicore/api.service"
import { MensajeService } from "src/app/services/util/mensaje.service"
import { UtilService } from "src/app/services/util/util.service"

@Component({
  selector: "app-maestro",
  templateUrl: "./maestro.component.html",
  styleUrls: ["./maestro.component.scss"],
})
export class MaestroComponent implements OnInit {
  public code: string
  public name: string
  public description: string
  public xyear: string
  public xcode: string
  public version: string

  @Input() ssetable: any //la tabla en la que vamos a insertar
  @ViewChild("wzdocumentos", { static: true }) wzdocumentos: TemplateRef<any>

  public xAPI: IAPICore = {
    funcion: "",
    valores: {},
    parametros: "",
  }

  public object: any
  public object_aux: any
  public soe = false
  public page = "soe"

  public titulo = "DEL PRODUCTOS"
  public fnx = "PRC_IProducts"
  public id_product = undefined
  public id_soe = undefined

  public blDoc = false
  public xdocument: number

  constructor(
    public dialog: MatDialog,
    private utilService: UtilService,
    private apiService: ApiService,
    private msj: MensajeService
  ) {}

  ngOnInit(): void {
    this.code = this.utilService.GenerarUnicId().toUpperCase()
  }

  ngOnChanges() {
    if (this.ssetable != "") {
      this.object = JSON.parse(this.ssetable)
      this.code = this.object.id
      this.newProccess()
    }
  }

  openDialog(): void {
    this.xdocument = parseInt(this.code)

    const dialogRef = this.dialog.open(this.wzdocumentos, {
      width: "850px",
      data: {},
    })

    dialogRef.afterClosed().subscribe((result) => {
      // console.log("The dialog was closed")
      // this.object.id = '1'
      // this.object.id_product = '1'
      // this.object.id_soe = '1'
      let resp = {
        type: 'section',
        obj: this.object,
      }
      console.log(resp)
      this.msj.producto$.emit(resp)
    })
  }

  newProccess() {
    this.titulo = "DE LA SOE " + this.object.description.toUpperCase()
    this.soe = true
    this.fnx = "PRC_ISoe"
    this.page = "section"
    this.id_product = this.object.id

    if (this.object.id_product != undefined) {
      this.object_aux = this.object

      this.id_soe = this.object.id != undefined ? this.object.id : undefined
      this.titulo = "DE LA SECCION " + this.object.description.toUpperCase()
      this.soe = false
      this.fnx = "PRC_ISections"
      this.page = "documents"
      this.blDoc = true
    }

    // this.fnx = this.ssetable != 'soe' ? 'PRC_ISoe' : 'PRC_ISection'
  }

  /**
   * clone section for documents
   */
  clone() {
    
  }

  getObject(): any {
    return {
      id: null,
      name: this.name.toUpperCase(),
      description: this.description.toUpperCase(),
      code: this.xcode,
      xyear: this.xyear,
      version: this.version,
      id_product: this.id_product,
      id_soe: this.id_soe,
    }
  }
  guardar() {
    if(this.name == undefined || this.description == undefined) return false
    if(this.name == '' || this.description == '') return false
    this.object = this.getObject()
    this.xAPI.funcion = this.fnx
    this.xAPI.valores = JSON.stringify(this.object)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.object.id = data.msj
        let resp = {
          type: this.page,
          obj: this.object,
        }
        if (this.object.id_soe != undefined) {
          resp.obj = this.object_aux
        } else {
          this.newProccess()
        }
        this.msj.contenido$.emit(this.object.description)
        this.msj.producto$.emit(resp)
        this.limpiar()
      },
      (error) => {
        console.error(error)
      }
    )
  }
  limpiar() {
    this.name = ""
    this.description = ""
    this.code = ""
    this.xcode = ""
    this.version = ""
    this.xyear = ""
  }

  salir() {
    this.msj.contenido$.emit({
      type: undefined,
      obj: undefined,
    })
    this.soe = false
    this.code = ""
  }
}
