import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'menu-alumno',
    loadChildren: () => import('./menu-alumno/menu-alumno.module').then( m => m.MenuAlumnoPageModule)
  },
  {
    path: 'menu-profesor',
    loadChildren: () => import('./menu-profesor/menu-profesor.module').then( m => m.MenuProfesorPageModule)
  },
  {
    path: 'asignaturas-alumnos',
    loadChildren: () => import('./asignaturas-alumnos/asignaturas-alumnos.module').then( m => m.AsignaturasAlumnosPageModule)
  },
  {
    path: 'asistencias-alumnos',
    loadChildren: () => import('./asistencias-alumnos/asistencias-alumnos.module').then( m => m.AsistenciasAlumnosPageModule)
  },
  {
    path: 'cambiar-clave',
    loadChildren: () => import('./cambiar-clave/cambiar-clave.module').then( m => m.CambiarClavePageModule)
  },
  {
    path: 'registrar-asistencia',
    loadChildren: () => import('./registrar-asistencia/registrar-asistencia.module').then( m => m.RegistrarAsistenciaPageModule)
  },
  {
    path: 'cambiar-clave-profesor',
    loadChildren: () => import('./cambiar-clave-profesor/cambiar-clave-profesor.module').then( m => m.CambiarClaveProfesorPageModule)
  },
  {
    path: 'asistencia-profesor',
    loadChildren: () => import('./asistencia-profesor/asistencia-profesor.module').then( m => m.AsistenciaProfesorPageModule)
  },
  {
    path: 'asignatura-profesor',
    loadChildren: () => import('./asignatura-profesor/asignatura-profesor.module').then( m => m.AsignaturaProfesorPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
