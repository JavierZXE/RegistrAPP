import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu-profesor',
  templateUrl: './menu-profesor.page.html',
  styleUrls: ['./menu-profesor.page.scss'],
})
export class MenuProfesorPage implements OnInit {
  welcomeMessage: string = '';
  constructor(private alertController: AlertController,
    private authService: AuthService,
    private router: Router,) {
    this.setWelcomeMessage();
  }
  private setWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.nombre) {
      this.welcomeMessage = `Bienvenido Profe ${currentUser.nombre}`;
    } else {
      this.welcomeMessage = 'Bienvenido';
    }
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

  ngOnInit() {
  }
}
