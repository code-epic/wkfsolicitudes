import { Routes } from '@angular/router';
import { ConfigurarComponent } from 'src/app/pages/configurar/configurar.component';
import { BuscadorComponent } from 'src/app/pages/generico/buscador/buscador.component';
import { PerfilComponent } from 'src/app/pages/generico/perfil/perfil.component';
import { ReportesComponent } from 'src/app/pages/reportes/reportes.component';
import { AuthGuardGuard } from 'src/app/services/seguridad/auth-guard.guard';

import { PrincipalComponent } from '../../pages/principal/principal.component';
import { AdministracionComponent } from '../../pages/principal/administracion/administracion.component';
import { DocumentosComponent } from 'src/app/pages/principal/administracion/documentos/documentos.component';
import { ProductosComponent } from 'src/app/pages/principal/administracion/productos/productos.component';
import { ExpedientesComponent } from 'src/app/pages/principal/expedientes/expedientes.component';
import { ConformacionComponent } from 'src/app/pages/principal/conformacion/conformacion.component';
import { SolicitudComponent } from 'src/app/pages/principal/solicitud/solicitud.component';
import { AreaSupervisoraComponent } from 'src/app/pages/principal/area-supervisora/area-supervisora.component';
import { AreaSolucionadoraComponent } from 'src/app/pages/principal/area-solucionadora/area-solucionadora.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'principal',
        component: PrincipalComponent,
        canActivate: [AuthGuardGuard]
    }, {
        path: 'buscador',
        component: BuscadorComponent,
    }, {
        path: 'perfil',
        component: PerfilComponent,
    }, {
        path: 'configurar',
        component: ConfigurarComponent,
    }, {
        path: 'reportes',
        component: ReportesComponent,
        canActivate: [AuthGuardGuard]
    }, {
        path: 'administracion',
        component: AdministracionComponent
    }, {
        path: 'documentos',
        component: DocumentosComponent
    }, {
        path: 'productos',
        component: ProductosComponent
    }, {
        path: 'solicitud',
        component: SolicitudComponent
    }, {
        path: 'area-supervisora',
        component: ConformacionComponent
    }, {
        path: 'area-solucionadora',
        component: AreaSolucionadoraComponent
    },
    {
        path: 'expediente',
        component: ExpedientesComponent
    },

];

