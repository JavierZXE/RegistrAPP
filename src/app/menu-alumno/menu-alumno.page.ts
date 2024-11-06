import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu-alumno',
  templateUrl: './menu-alumno.page.html',
  styleUrls: ['./menu-alumno.page.scss'],
})
export class MenuAlumnoPage implements OnInit {
  welcomeMessage: string = '';
  codigoAsistencia: string = '';
  constructor(private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
  ) {
    this.setWelcomeMessage();
  }

  async logOutAlumno() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }

  registrarAsistencia() {
    if (this.codigoAsistencia) {
      const [codigoSeccion, fecha] = this.codigoAsistencia.split('|');
      if (codigoSeccion && fecha) {
        const usuario = this.authService.getCurrentUser();
        const alumnoId = usuario.id;
        const estado = 'presente';
        
        this.authService.addAsistencia(alumnoId, codigoSeccion, fecha, estado).subscribe(
          (response) => {
            console.log('Asistencia registrada correctamente', response);
          },
          (error) => {
            console.error('Error al registrar la asistencia', error);
          }
        );
      } else {
        console.error('El formato del código de asistencia es incorrecto');
      }
      this.codigoAsistencia = '';
    } else {
      console.error('Debe ingresar un código de asistencia');
    }
  }

  private setWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.nombre) {
      this.welcomeMessage = `Bienvenido ${currentUser.nombre}`;
    } else {
      this.welcomeMessage = 'Bienvenido';
    }
  }

  ngOnInit() {
  }

}
