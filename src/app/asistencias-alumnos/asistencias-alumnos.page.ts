import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-asistencias-alumnos',
  templateUrl: './asistencias-alumnos.page.html',
  styleUrls: ['./asistencias-alumnos.page.scss'],
})
export class AsistenciasAlumnosPage implements OnInit {
  asistencias: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAsistenciasByAlumnoId().subscribe(
      (data) => {
        this.asistencias = data;
      },
      (error) => {
        console.error('Error al obtener asistencias:', error);
      }
    );
    console.log(this.authService.getCurrentUser());
  }

}
