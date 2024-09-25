import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.page.html',
  styleUrls: ['./cambiar-clave.page.scss'],
})
export class CambiarClavePage implements OnInit {

  constructor(private alertController: AlertController) {}

  async restablecerPwd()
  {
    const alert = await this.alertController.create({
      header: "¡Clave cambiada!",
      message: "Se ha cambiado la clave del usuario correctamente",
      buttons: ['Entendido']
    });
    await alert.present();
  }

  ngOnInit() {
  }

}
