import { Component, OnInit, Inject } from "@angular/core"
import { FormControl } from "@angular/forms"
import { ApiService, IAPICore } from "src/app/services/apicore/api.service"
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog"
import { ToastrService } from "ngx-toastr"
import { UtilService } from "src/app/services/util/util.service"
import { LoginService } from "src/app/services/seguridad/login.service"
import { ActivatedRoute, Router } from "@angular/router"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { IWKFAlerta } from "src/app/services/proceedings/buzon.service"

@Component({
  selector: 'app-conformacion',
  templateUrl: './conformacion.component.html',
  styleUrls: ['./conformacion.component.scss']
})
export class ConformacionComponent implements OnInit {
  public estadoInicial = 0 //donde esta
  public estadoOrigen = 1 //de donde viene
  public estatusInicial = 1 // que posicion ocupa
  public estatusActual = 1
  public estatusDestino = 1 // que posicion ocupa
  public estadoDestino = 0 //para donde va en un flujo normal
  public posicionDocumento = 0 //para donde va en un flujo normal
  public selecionDocumento = 0

  clasificacion = false
  vplazo = false
  bEdicion = false
  bFrm = false

  bR = true
  bP = false
  bC = false

  tabs = []
  bzBuzon = []
  lstAcciones = []

  selected = new FormControl(0)

  AccionTexto = ""
  Observacion = ""
  public estilocheck = "none"
  public estiloclasificar = "none"
  public numControl = ""
  public cmbDestino = "S"

  public TipoReporte = ""
  public Categoria = ""
  public Codigo = ""
  public Cedula = ""
  public Nombre = ""
  public Edad = ""
  public Correo = ""
  public Telefono = ""
  public Contenido = ""
  public Respuesta = ""

  lstEstados = []

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  }

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: "",
    usuario: "",
    observacion: "",
  }

  public extender_plazo: any
  public cmbAcciones = [
    { valor: "0", texto: "Aceptar", visible: "0" },
    { valor: "1", texto: "Enviar a atención al ciudadano", visible: "0" },
    { valor: "2", texto: "Aceptar", visible: "1" },
    { valor: "3", texto: "Redistribuir", visible: "1" },
    { valor: "4", texto: "Cerrar Caso", visible: "1" },
  ]

  constructor(
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private rutaActiva: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.ngxService.startLoader("load-buzon")
    // if (this.rutaActiva.snapshot.params.id != undefined) {
    //   this.estadoOrigen = this.rutaActiva.snapshot.params.id
    // }

    // let items = window.sessionStorage.getItem("estados")
    // if (items != undefined) {
    //   this.lstEstados = JSON.parse(items)
    // } else {
    //   this.router.navigate(["/principal"])
    // }

    this.ConsultarEstatus()
    this.cargarAcciones()
  }

  setCodigo(id): string {
    return this.utilService.zfill(id, 6)
  }

  async cargarAcciones() {
    let posicion = this.estadoOrigen == 13 ? "1" : "0"

    this.lstAcciones = []
    this.lstAcciones = this.cmbAcciones.filter((e) => {
      return e.visible == posicion
    })
  }

  seleccionNavegacion(e) {
    this.bR = false
    this.bP = false
    this.bC = false

    switch (e) {
      case 0:
        this.bR = true
        break
      case 1:
        this.bP = true
        break
      case 2:
        this.bC = true
        break
      default:
        break
    }
  }

  ConsultarEstatus() {
    //WKF_CEstados
    this.xAPI.funcion = "WKF_CEstatus"
    this.xAPI.parametros = this.estadoOrigen.toString()
    this.xAPI.valores = ""

    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        this.xAPI.funcion = "WKF_CDocumentos"
        this.bzBuzon = []
        await data.Cuerpo.map(async (e) => {
          this.tabs.push(e.nomb.toString().toUpperCase())
          this.xAPI.parametros =
            this.estadoOrigen.toString() + "," + e.idc.toString()
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              // console.log(xdata)
              this.bzBuzon[e.idc] = xdata.Cuerpo
            },
            (err) => {
              console.error(err)
            }
          )
        })
        this.ngxService.stopLoader("load-buzon")
        this.tabs.push("NOTIFICACIONES")
        this.selected.setValue(0)
      },
      (err) => {
        console.error(err)
      }
    )
  }

  selChange(e) {
    switch (this.AccionTexto) {
      case "3":
        this.clasificacion = true
        this.vplazo = true
        break
      default:
        break
    }
  }

  insertarObservacion() {
    if (this.AccionTexto == "S") {
      this.toastrService.warning(
        "Debe seleccionar una accion ",
        `GDoc Wkf.DocumentoObservacion`
      )
      return false
    }
    const usuario = this.loginService.Usuario.id
    this.xAPI.funcion = "WKF_IDocumentoObservacion"
    this.xAPI.valores = JSON.stringify({
      documento: this.numControl,
      estado: this.estadoOrigen, //Estado que ocupa
      estatus: this.estatusActual,
      observacion: this.Observacion.toUpperCase(),
      accion: this.AccionTexto,
      usuario: usuario,
    })

    this.xAPI.parametros = ""
    // console.log(this.xAPI)
    // console.log(this.numControl)
    //
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        switch (this.AccionTexto) {
          case "0": //Aceptar y promover el documento
            this.promoverBuzon(0, this.utilService.FechaActual())
            this.quitarElemento(this.numControl, 1)
            break
          case "1": //Redistribuir
            this.estatusDestino = 1
            this.quitarElemento(this.numControl, 0)
            this.redistribuir(13) //Seguridad Ciudadana...
            break
          case "2": //Aceptar y promover el documento
            this.promoverBuzon(0, this.utilService.FechaActual())
            this.quitarElemento(this.numControl, 1)
            break
          case "3": //Elige el destino por opinión
            this.redistribuir(0)
            break
        }
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`)
      }
    )
  }

  async promoverBuzon(activo: number, sfecha: string) {
    var fecha = ""
    if (sfecha == "") {
      console.log(this.extender_plazo)
      if (this.extender_plazo == undefined) {
        this.toastrService.warning(
          "Debe seleccionar una fecha ",
          `GDoc Wkf.DocumentoObservacion`
        )
        return false
      } else {
        fecha = this.utilService.ConvertirFecha(this.extender_plazo)
      }
    } else {
      fecha = sfecha
    }

    sfecha == ""
      ? this.utilService.ConvertirFecha(this.extender_plazo)
      : sfecha

    var usuario = this.loginService.Usuario.id
    var i = 0
    var estatus = 1 //NOTA DE ENTREGA
    //Buscar en Wk de acuerdo al usuario y la app activa
    this.xAPI.funcion = "WKF_APromoverEstatus"
    this.xAPI.valores = ""

    this.xAPI.parametros = `${estatus},${usuario},${this.numControl}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        await this.guardarAlerta(activo, fecha)
        //this.seleccionNavegacion(this.selNav)
        this.Observacion = ""
        this.numControl = "0"
        this.toastrService.success(
          "Se ha promovido el documento",
          `GDoc Wkf.DocumentoObservacion`
        )
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.PromoverDocumento`)
      }
    ) //
  }

  async redistribuir(destino: number = 0) {
    var dst = destino != 0 ? destino : this.cmbDestino

    this.xAPI.funcion = "WKF_ARedistribuir"
    this.xAPI.valores = ""
    this.xAPI.parametros =
      dst +
      "," +
      dst +
      "," +
      this.estatusDestino +
      "," +
      this.loginService.Usuario.id +
      "," +

      // console.log(this.xAPI.parametros)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          let sfecha =
            this.extender_plazo == undefined
              ? this.utilService.FechaActual()
              : this.utilService.ConvertirFecha(this.extender_plazo)
          this.guardarAlerta(1, sfecha)
          this.toastrService.success(
            "El documento ha sido redistribuido segun su selección",
            `GDoc Wkf.DocumentoObservacion`
          )
          //this.seleccionNavegacion(this.selNav)
        },
        (error) => {
          console.error(error)
        }
      )
  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo
    this.WAlerta.documento = parseInt(this.numControl)
    this.WAlerta.estado = this.estadoOrigen
    this.WAlerta.estatus = this.estatusDestino
    this.WAlerta.usuario = this.loginService.Usuario.id
    this.WAlerta.observacion = this.Observacion.toUpperCase()
    this.WAlerta.fecha = fecha

    this.xAPI.funcion = "WKF_AAlertas"
    this.xAPI.parametros = ""
    console.log(this.WAlerta)
    this.xAPI.valores = JSON.stringify(this.WAlerta)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (alerData) => {
        console.log(alerData)
        this.ngxService.stopLoader("load-buzon")
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`)
      }
    ) //
  }

  quitarElemento(codigo, acc) {
    var posicion = 0
    var i = 0
    let element = {}

    this.bzBuzon[this.estatusActual].forEach((e) => {
      if (e.idd == codigo) {
        posicion = i
        element = e
        return
      }
      i++
    })
    if (acc != 0) this.bzBuzon[2].push(element)
    this.bzBuzon[this.estatusActual].splice(posicion, 1)
    console.log(this.bzBuzon)
  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push("New")

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1)
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1)
  }

  mapElement(e) {
    this.numControl = e.idd

    this.Codigo = this.setCodigo(e.idd)
    this.TipoReporte = e.tdoc
    this.Categoria = this.setCategoria(e.udep)
    this.Nombre = e.nori
    this.Cedula = e.saso
    this.Contenido = e.cont.toString().toUpperCase()
    this.Correo = e.remi
    this.Respuesta = e.inst
  }

  openDialog(content, e, tipo): void {
    let sWidth = "600px"

    // this.hashcontrol = btoa( "D" + this.numControl) //Cifrar documentos
    if (tipo == 1) {
      sWidth = "800px"
      this.mapElement(e)
    } else {
      this.numControl = e
    }

    const dialogRef = this.dialog.open(content, {
      width: sWidth,
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed")
    })
  }

  viewFrm(content, e, tipo, seleccion: number, posicion: number): void {
    this.posicionDocumento = posicion
    this.selecionDocumento = seleccion + 1

    this.ngxService.startLoader("load-buzon")
    this.mapElement(e)
    this.xAPI.funcion = "WKF_CDocumentoDetalle"
    this.xAPI.parametros = `${this.estatusActual},${this.estatusActual},${this.numControl}`
    this.xAPI.valores = ""

    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        // console.log(data)
        this.ngxService.stopLoader("load-buzon")
        this.bFrm = true

      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`)
      }
    ) //

  }

  hideFrm() {
    this.bEdicion = false
    this.bFrm = false
    this.selected.setValue(1)
    this.bEdicion = true
  }

  closeDialog() {
    this.dialog.closeAll()
  }

  setCategoria(id): string {
    return id == "0" ? "Servicios" : "Trámites"
  }

  actualizarDocumento(estatus: number) {

    this.ngxService.startLoader("load-buzon")
    let rsp = {
      identificador: this.numControl,
      respuesta: this.Respuesta.toUpperCase(),
      usuario: this.loginService.Usuario.id,
    }


    this.bzBuzon[this.selecionDocumento][this.posicionDocumento].inst = this.Respuesta.toUpperCase()

    this.xAPI.funcion = "WKF_ADocumentoRespuesta"
    this.xAPI.valores = JSON.stringify(rsp)

    console.log(rsp)

    this.xAPI.parametros = ``
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (estatus == 0) {
          this.promoverBuzon(0, this.utilService.FechaActual())
          this.quitarElemento(this.numControl, 1)
          this.hideFrm()
          return
        }

        this.ngxService.stopLoader("load-buzon")
        this.hideFrm()
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc WKF_ADocumentoRespuesta`)
      }
    ) //
  }
}