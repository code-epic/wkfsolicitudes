import { Component, Input, OnInit } from "@angular/core"
import { FormControl } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { NgbDate, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { Observable, map, startWith } from "rxjs"
import { ApiService, IAPICore } from "src/app/services/apicore/api.service"
import { UtilService } from "src/app/services/util/util.service"

@Component({
  selector: "app-wzconfig",
  templateUrl: "./wzconfig.component.html",
  styleUrls: ["./wzconfig.component.scss"],
})
export class WzconfigComponent implements OnInit {
  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
  }

  @Input() xdocument: any
  myDoc = new FormControl("")
  docs: string[] = []
  filteredDoc: Observable<string[]>

  public lstDocs = []
  public selectedIndex = 0
  public active: boolean = false
  public obj: any
  public titulo = ""
  public documento = ""
  public codigo = ""

  public fechaini: any
  public fecha_ini: NgbDate | null

  public description: any

  public lstConditions = []

  constructor(
    public formatter: NgbDateParserFormatter,
    public dialog: MatDialog,
    private utilService: UtilService,
    private ngxService: NgxUiLoaderService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // console.log(this.xdocument)
    this.obj = JSON.parse(this.xdocument)
    this.ListarDocumentos()
    this.titulo = this.obj.elem.description
    this.consultarSeccionDocumentos()
    // console.log(this.obj.elem.id)
  }

  tabActive(event) {
    this.selectedIndex = event.index
    if (this.selectedIndex == 1 && this.active) {
      console.log("seleccion general")
    } else if (this.selectedIndex == 1 && !this.active) {
      console.log("Debe seleccionar un documento")
    }
    this.active = false
  }

  editar(e) {
    this.selectedIndex = 1
    this.active = true
    this.codigo = e.id
    this.documento = e.description
    console.log(e)
  }

  ListarDocumentos() {
    this.xAPI.funcion = "PRC_CDocument"
    this.xAPI.parametros = ""
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        if (data != null && data.msj == undefined) {
          data.Cuerpo.forEach((e) => {
            let valor = this.utilService.zfill(e.id, 4) + " | " + e.description
            this.docs.push(valor)
          })
        }

        this.filteredDoc = this.myDoc.valueChanges.pipe(
          startWith(""),
          map((value) => this._filterdocs(value || ""))
        )
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private _filterdocs(value: string): string[] {
    const filterValue = value.toLowerCase()

    return this.docs.filter((option) =>
      option.toLowerCase().includes(filterValue)
    )
  }

  consultarSeccionDocumentos(){
    this.lstDocs = []
    this.xAPI.funcion = "PRC_CSeccionDocumentos"
    this.xAPI.parametros = this.obj.elem.id
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map( e => {
          this.lstDocs.push({
            id: e.id_documento,
            description: e.documento,
          })
        }

        )
        
        this.ngxService.stopLoader("ld-xdoc")
      },
      (err) => {
        console.error(err)
      }
    )
  }

  async add() {
    this.ngxService.startLoader("ld-xdoc")
    if (this.myDoc.value.toString() == "") return false
    let active = false
    let cod = this.myDoc.value.toString().split("|")

    await this.lstDocs.map((e) => {
      if (e.id == cod[0]) {
        active = true
        return
      }
    })

    if (!active) {
      this.lstDocs.push({
        id: cod[0],
        description: cod[1],
      })
    }

    this.xAPI.funcion = "PRC_ISeccionDocumentos"
    this.xAPI.valores = JSON.stringify({
      documento: parseInt(cod[0]),
      seccion: parseInt(this.obj.elem.id),
    })
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ngxService.stopLoader("ld-xdoc")
      },
      (err) => {
        console.error(err)
      }
    )

    console.log(this.xAPI)

    this.myDoc.setValue("")
  }

  aceptar() {
    this.dialog.closeAll()
  }

  getStatus(e) {}

  addCondition() {
    if (this.description == "" || this.description == undefined) return false

    this.lstConditions.push({
      id: 0,
      description: this.description,
    })
    this.description = ""
  }
}
