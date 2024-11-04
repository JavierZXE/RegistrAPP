import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.page.html',
  styleUrls: ['./cambiar-clave.page.scss'],
})
export class CambiarClavePage {
  claveAntigua: string = '';
  claveNueva: string = '';
  confirmarClaveNueva: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  async cambiarClave() {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.contraseña === this.claveAntigua) {
      if (this.claveNueva === this.confirmarClaveNueva) {
        currentUser.contraseña = this.claveNueva;
        this.authService.updateUserPassword(currentUser);

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Contraseña actualizada correctamente.',
          buttons: ['OK']
        });
        await alert.present();

        this.authService.logout();
        this.router.navigate(['/home']);
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'La nueva clave y la confirmación no coinciden.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La clave antigua no es correcta.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
