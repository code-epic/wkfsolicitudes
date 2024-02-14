import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from "@angular/material/table"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { ApiService, IAPICore } from "src/app/services/apicore/api.service"
import {
  Condition,
  Documentos,
  Products,
  Rule,
  SOE,
  Section,
} from "src/app/services/proceedings/administracion.service"
import { MensajeService } from "src/app/services/util/mensaje.service"
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  styleUrls: ["./productos.component.scss"],
})
export class ProductosComponent implements OnInit {
  public SOE: SOE = {
    name: "",
    description: "",
    year: "",
    code: "",
    version: "",
  }

  public Section: Section[] = []

  public Rule: Rule[] = []
  public Condition: Condition[] = []

  public Doc: Documentos = {
    name: "",
    description: "",
    status: 0,
    format: "",
    required: 0,
    limit_mb: 0,
    docwkf: 0,
    id: 0,
    tipo: 0,
    idSub: 0,
  }

  public Product: Products = {
    name: "",
    description: "",
    code: "",
    Soe: this.SOE,
    Sections: this.Section,
  }

  public xAPI: IAPICore = {
    funcion: "",
    valores: {},
    parametros: "",
  }
  public blSection: boolean = false
  public blDoc: boolean = false

  public lstProducts = []

  public ELEMENT_DATA: Products[] = []

  public ssetable: any
  public xdocument: any
  public pagina = "products"

  displayedColumns: string[] = ["name", "description", "fecha", "id"]

  dataSource: any

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild("wzconfig", { static: true }) wzconfig: TemplateRef<any>


  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private msj: MensajeService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.consultar("PRC_CProducts")
    this.msj.producto$.subscribe((e) => {
      if (e.type == undefined) {
        this.xAPI.parametros = ""
        this.consultar("PRC_CProducts")
        this.pagina = "products"
        console.log("Pasandolo mal")
        return false
      }
      switch (e.type) {
        case "soe":
          console.log("Entrando en la SOE")
          this.ssetable = JSON.stringify(e.obj)
          this.pagina = "soe"
          if (e.obj.id_product == undefined) this.xAPI.parametros = e.obj.id
          this.consultar("PRC_CSoe")

          break
        case "section":
          console.log("Entrando en la SECTION")
          this.xAPI.parametros = e.obj.id
          this.pagina = "seccion"
          this.blSection = true
          this.consultar("PRC_CSections")
          break
        case "documents":
          console.log("Entrando en la DOCUMENT")
          this.xAPI.parametros = e.obj.id
          this.consultar("PRC_CSections")
          this.pagina = "documents"
          break
        default:
          break
      }
    })
  }

  /**
   * Configurar los archivos asociados a una seccion
   * @param e
   */
  folder(e): void {
    let cod = {
      'id_soe': this.xAPI.parametros,
      'elem': e
    }
    this.xdocument = JSON.stringify(cod)

    const dialogRef = this.dialog.open(this.wzconfig, {
      width: "1024px",
      data: {},
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log(e)
    })
  }


  config(e) {
    this.ssetable = JSON.stringify(e)
    let sitio = "PRC_CSoe"

    if (this.pagina == "section") {
      sitio = "PRC_CSections"
      this.pagina = "document"
      this.blSection = true
    }
    this.xAPI.parametros = e.id
    this.pagina = "section"
    this.consultar(sitio)
  }

  consultar(fnx: string) {
    this.ngxService.startLoader("loader-document")
    this.ELEMENT_DATA = []
    this.resetData()
    this.xAPI.funcion = fnx
    console.info("ejecutando .... ")
    console.log(this.xAPI)

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.ELEMENT_DATA = data.Cuerpo
        this.resetData()
        this.ngxService.stopLoader("loader-document")
      },
      (err) => {
        console.error(err)
        this.ngxService.stopLoader("loader-document")
      }
    )
  }

  resetData() {
    this.dataSource = new MatTableDataSource<Products>(this.ELEMENT_DATA)
    this.dataSource.paginator = this.paginator
  }

  ngOnChanges() {}

  guardar() {
    console.log(this.Product)
  }
}
