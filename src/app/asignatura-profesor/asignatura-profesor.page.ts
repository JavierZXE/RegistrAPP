import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-asignatura-profesor',
  templateUrl: './asignatura-profesor.page.html',
  styleUrls: ['./asignatura-profesor.page.scss'],
})
export class AsignaturaProfesorPage implements OnInit {
  subjectsWithDetails: any[] = [];
  constructor(private authService: AuthService ) { }

  async ngOnInit() {
    try {
      const teacherId = this.getUserId();

      const subjectCodes = await this.authService.getTeacherSubjects(this.getUserId());
      console.log('Códigos de asignaturas:', subjectCodes);

      if (subjectCodes.length === 0) {
        console.warn('No se encontraron asignaturas para este estudiante.');
        return; 
      }

      const subjectDetailsPromises = subjectCodes.map((code: string) => this.authService.getSubjectDetails(code));
      const subjectsDetails = await Promise.all(subjectDetailsPromises);
      console.log('Detalles de asignaturas:', subjectsDetails);

      this.subjectsWithDetails = subjectsDetails
        .filter(subject => subject !== null)
        .map(subject => ({
          ...subject!,
          secciones: subject!.secciones.filter(seccion =>
            seccion.alumnos_inscritos.includes(parseInt(teacherId))
          )
        }))
        .filter(subject => subject.secciones.length > 0);

      console.log('Asignaturas con secciones filtradas:', this.subjectsWithDetails);

    } catch (error) {
      console.error('Error al obtener los detalles de las asignaturas', error);
    }
  }


  private getUserId(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.id : '';
  }
}
