import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-menu-alumno',
  templateUrl: './menu-alumno.page.html',
  styleUrls: ['./menu-alumno.page.scss'],
})
export class MenuAlumnoPage implements OnInit {
  welcomeMessage: string = '';
  codigoAsistencia: string = '';
  scanResult = '';

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private router: Router,
    private modalController: ModalController
  ) {
    this.setWelcomeMessage();
  }

  ngOnInit(): void {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data && data?.barcode?.displayValue) {
      this.codigoAsistencia = data.barcode.displayValue;
      this.registrarAsistenciaConCodigo(this.codigoAsistencia);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo escanear el código. Intente nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async registrarAsistenciaConCodigo(codigo: string) {
    const [codigoSeccion, fecha] = codigo.split('|');

    if (codigoSeccion && fecha) {
      const usuario = this.authService.getCurrentUser();
      const alumnoId = usuario.id;
      const estado = 'presente';

      const pertenece = await this.authService.alumnoPerteneceASeccion(alumnoId, codigoSeccion);

      if (!pertenece) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El alumno no está inscrito en esta sección.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }

      this.authService.getAsistenciasAlumno(alumnoId, codigoSeccion).subscribe(
        async (asistencias) => {
          const asistenciaExistente = asistencias.some((asistencia: any) =>
            asistencia.asistencias.some((a: any) => a.fecha === fecha)
          );

          if (asistenciaExistente) {
            const alert = await this.alertController.create({
              header: 'Asistencia ya registrada',
              message: 'Ya existe una asistencia registrada para esta sección y fecha.',
              buttons: ['OK'],
            });
            await alert.present();
          } else {
            this.authService.addAsistencia(alumnoId, codigoSeccion, fecha, estado).subscribe(
              async (response) => {
                const successAlert = await this.alertController.create({
                  header: 'Éxito',
                  message: 'Asistencia registrada correctamente',
                  buttons: ['OK'],
                });
                await successAlert.present();
              },
              async (error) => {
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: `Algo salió mal al registrar la asistencia: ${error.message || error}`,
                  buttons: ['OK'],
                });
                await errorAlert.present();
              }
            );
          }
        },
        async (error) => {
          const errorAlert = await this.alertController.create({
            header: 'Error',
            message: `Error al verificar la asistencia: ${error.message || error}`,
            buttons: ['OK'],
          });
          await errorAlert.present();
        }
      );
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El formato del código no es válido.',
        buttons: ['OK'],
      });
      await alert.present();
      this.codigoAsistencia = '';
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
