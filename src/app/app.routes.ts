import { Routes } from '@angular/router';
import {InicioComponente} from '../features/componentes/inicio-componente/inicio-componente';
import {TipoComponente} from '../features/componentes/tipo-componente/tipo-componente';
import {PaisComponente} from '../features/componentes/pais-componente/pais-componente';
import {FestivoComponente} from '../features/componentes/festivo-componente/festivo-componente';
import {ConsultaComponente} from '../features/componentes/consulta-componente/consulta-componente';

export const routes: Routes = [
  { path: "", redirectTo: "inicio", pathMatch: "full" },
  { path: "inicio", component: InicioComponente },
  { path: "tipos", component: TipoComponente },
  { path: "paises", component: PaisComponente },
  { path: "festivos", component: FestivoComponente },
  { path: "consulta", component: ConsultaComponente },
];
