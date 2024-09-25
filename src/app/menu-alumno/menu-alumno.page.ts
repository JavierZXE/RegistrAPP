import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu-alumno',
  templateUrl: './menu-alumno.page.html',
  styleUrls: ['./menu-alumno.page.scss'],
})
export class MenuAlumnoPage implements OnInit {

  constructor(private alertController: AlertController) {}

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
