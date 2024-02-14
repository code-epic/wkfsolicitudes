import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-wzclasificacion',
  templateUrl: './wzclasificacion.component.html',
  styleUrls: ['./wzclasificacion.component.scss']
})
export class WzclasificacionComponent implements OnInit {

  public documento : string = ''

  public lstConditions = [
    'FIRMADO POR EL CONTADOR PUBLICO',
    'QUE SEA LEGIBLE POR AMBAS CARAS',
    'VISADO POR UN CONTADOR',
    'CERTIFICADO'
  ]

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  aceptar(){
    this.dialog.closeAll()
  }
  

  listarDocRule(){
    
  }

}
