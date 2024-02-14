import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Products } from "src/app/services/proceedings/administracion.service";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { MensajeService } from "src/app/services/util/mensaje.service";
import { MatDialog } from "@angular/material/dialog";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-wzdocumentos",
  templateUrl: "./wzdocumentos.component.html",
  styleUrls: ["./wzdocumentos.component.scss"],
})
export class WzdocumentosComponent implements OnInit {
  public ELEMENT_DATA: Products[] = [];

  public ssetable: any;
  public pagina = "products";

  public xAPI: IAPICore = {
    funcion: "",
    valores: {},
    parametros: "",
  };

  @Input() xdocument: number;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService, 
    private ngxService: NgxUiLoaderService,
    private msj: MensajeService) {}

  ngOnInit(): void {
    this.consultar("PRC_CTotalSoe");
  }

  consultar(fnx: string) {
    this.ELEMENT_DATA = [];
    this.xAPI.funcion = fnx;

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ELEMENT_DATA = data.Cuerpo;
      },
      (err) => {
        console.error(err);
      }
    );
  }


  clone(e) {
    this.ngxService.startLoader('loader-xdocument')
    this.xAPI.funcion = 'PRC_ISeccionSoe';
    this.xAPI.parametros = this.xdocument.toString() + ',' + e.id
    
    
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.apiService.Mensaje(
          "Felicitaciones, Proceso exitoso",
          "Creacion de la seccion completada",
          "success",
          "documento"
        );
        this.ngxService.stopLoader('loader-xdocument')
        this.dialog.closeAll()
      },
      (err) => {
        console.error(err);
        this.ngxService.stopLoader('loader-xdocument')
        this.dialog.closeAll()
      }
    );
  }
}
