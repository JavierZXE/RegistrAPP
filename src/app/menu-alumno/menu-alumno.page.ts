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

  private setWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.nombre) {
      this.welcomeMessage = `Bienvenido ${currentUser.nombre}`;
    } else {
      this.welcomeMessage = 'Bienvenido';
    }
  }

  async registrarAsistencia()
  {
    const alert = await this.alertController.create({
      header: "¡Asistencia registrada!",
      message: "Se ha registrado correctamente su asistencia, puede revisar el estado de sus asistencias en la pestaña 'Mis Asistencias'.",
      buttons: ['Entendido']
    });
    await alert.present();
  }

  ngOnInit() {
  }

}
