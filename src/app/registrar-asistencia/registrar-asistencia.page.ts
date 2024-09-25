import { Component, OnInit } from '@angular/core';
import { QrCodeModule } from 'ng-qrcode';

@Component({
  selector: 'app-registrar-asistencia',
  templateUrl: './registrar-asistencia.page.html',
  styleUrls: ['./registrar-asistencia.page.scss'],
})
export class RegistrarAsistenciaPage implements OnInit {
  qrSize: number = 300;

  constructor() { }

  onRangeChange(event: any) {
    this.qrSize = event.detail.value;
  }

  ngOnInit() {
  }

}
