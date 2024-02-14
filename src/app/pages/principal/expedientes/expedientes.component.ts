import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ApiService } from "src/app/services/apicore/api.service";
import { MensajeService } from "src/app/services/util/mensaje.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-expedientes",
  templateUrl: "./expedientes.component.html",
  styleUrls: ["./expedientes.component.scss"],
})
export class ExpedientesComponent implements OnInit {
  public msjs = `Balance  Personal vigente, firmado por el cliente y preparado por Contador Público Colegiado, con 
  fecha de emisión no mayor a 6 meses para clientes y fiadores. Dichos balances pueden ser firmados por un Contador 
  Público Colegiado, Licenciados en Administración y Economistas. La Superintendencia de las Instituciones del Sector 
  Bancario (SUDEBAN), podrá exigir, que sus balances  o estados de ingresos y egresos sean dictaminados por contadores 
  públicos en ejercicio independiente de su profesión, cuando el crédito solicitado exceda de un monto equivalente a 
  ocho mil unidades tributarias (8.000 U.T.). Adicionalmente  debe estar firmado por el cliente
`;

  public lstDocs = [
    '000_J30167756_Contrato de arrendamiento_01-Jul-22.pdf',
    '000_J30167756_Modelo Transaccional_26-Jul-22.pdf',
    '001_J30167756_Estados Financieros_31-Dic-21.pdf',
    '002_J30167756_Balance Comprobación_30-Jun-22.pdf',
    '003_J30167756_Estados Financieros Alexander Sanchez V20024995_31-May-22.pdf',
    '005_J30167756_Certificación Ingresos Alexander Sanchez V20024995_31-May-22.pdf',
    '006_J30167756_ISLR_31-Dic-21.pdf',
    '007_J30167756_ISLR Alexander Sanchez V20024995_31-Dic-21.pdf',
    '008_J30167756_RIF_15-Dic-23.pdf',
    '009_J30167756_RIF Alexander Sanchez V20024995_28-Feb-23.pdf',
    '009_J30167756_RIF Francy Alvarado V12091975_15-Feb-25.pdf',
    '012_J30167756_CI Alexander Sanchez V20024995_10-Jul-24.pdf',
    '012_J30167756_CI Francy Alvarado V12091975_18-Oct-29.pdf',
    '014_J30167756_Acta Constitutiva_25-Nov-93.pdf',
    '016_J30167756_Minuta Crédito_09-Ago-22_01020742580000000012.pdf',
    '016_J30167756_Minuta Crédito_12-Jul-23_01020742580000000043.pdf',
    '016_J30167756_Minuta Crédito_24-Ago-23_01020742580000000048.pdf',
    '017_J30167756_Minuta Línea_09-Ago-22_Cupo.pdf',
    '017_J30167756_Minuta Línea_11-Jul-23.pdf',
    '018_J30167756_Documento Crédito_12-Ago-22_01020742580000000012.pdf',
    '018_J30167756_Documento Crédito_13-Jul-23_01020742580000000043.pdf',
    '018_J30167756_Documento Crédito_24-Ago-23_01020742580000000048.pdf',
    '021_J30167756_Informe Visita_07-Jul-22.pdf',
    '022_J30167756_Solicitud Crédito_21-Jun-22_Carta.pdf',
    '022_J30167756_Solicitud Crédito_21-Jun-22.pdf',
    ];

  public blListado: boolean = false;

  @ViewChild("wzclasificacion", { static: true }) wzclasificacion: TemplateRef<any>

  public wzdoc : any


  
  constructor(
    public dialog: MatDialog,
    private utilService: UtilService,
    private apiService: ApiService,
    private msj: MensajeService

  ) // private _snackBar: MatSnackBar

  {}

  ngOnInit(): void {}

  openDialog(): void {
    this.wzdoc = ''

    const dialogRef = this.dialog.open(this.wzclasificacion, {
      width: "550px",
      data: {},
    })

    dialogRef.afterClosed().subscribe((result) => {
      // console.log("The dialog was closed")
      // this.object.id = '1'
      // this.object.id_product = '1'
      // this.object.id_soe = '1'
    })
  }


  listar(items: string) {
    switch (items) {
      case "pdf":
        this.blListado = true;
        break;
      case "doc":
        this.blListado = true;
        break;

      case "img":
        this.blListado = true;
        break;

      case "zip":
        this.blListado = true;
        break;
      case "otr":
        this.blListado = true;
        break;

      default:
        break;
    }
  }
  editar(e){
    this.openDialog()
  }
}






