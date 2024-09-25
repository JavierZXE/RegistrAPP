import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-clave-profesor',
  templateUrl: './cambiar-clave-profesor.page.html',
  styleUrls: ['./cambiar-clave-profesor.page.scss'],
})
export class CambiarClaveProfesorPage implements OnInit {

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
