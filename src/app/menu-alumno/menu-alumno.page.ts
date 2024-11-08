import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { QrScannerModalComponent } from '../qr-scanner-modal/qr-scanner-modal.component';

@Component({
  selector: 'app-menu-alumno',
  templateUrl: './menu-alumno.page.html',
  styleUrls: ['./menu-alumno.page.scss'],
})
export class MenuAlumnoPage implements OnInit {
  welcomeMessage: string = '';
  codigoAsistencia: string = '';

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) {
    this.setWelcomeMessage();
  }

  ngOnInit() {}

  async openQrScanner() {
    const modal = await this.modalController.create({
      component: QrScannerModalComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.codigoAsistencia = result.data;
        this.registrarAsistenciaConCodigo(result.data);
      }
    });

    await modal.present();
  }

  registrarAsistenciaConCodigo(codigo: string) {
    const [codigoSeccion, fecha] = codigo.split('|');
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
  }

  private setWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.welcomeMessage = currentUser?.nombre ? `Bienvenido ${currentUser.nombre}` : 'Bienvenido';
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
}

