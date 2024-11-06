import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-asignatura-profesor',
  templateUrl: './asignatura-profesor.page.html',
  styleUrls: ['./asignatura-profesor.page.scss'],
})
export class AsignaturaProfesorPage implements OnInit {

  constructor(private authService: AuthService ) { }

  ngOnInit() {
  }


  private getUserId(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.id : '';
  }
}
