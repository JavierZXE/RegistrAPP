import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedCard: string = 'first';
  constructor(private alertController: AlertController) {}

  async restablecerPwd()
  {
    const alert = await this.alertController.create({
      header: "Recuperar Contraseña",
      subHeader: "Verifica tu Correo",
      message: "Se ha enviado un correo a la dirección proporcionada para restablecer la contraseña del usuario mencionado.",
      buttons: ['Entendido']
    });
    await alert.present();
  }
}
