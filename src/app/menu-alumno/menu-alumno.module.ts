import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuAlumnoPageRoutingModule } from './menu-alumno-routing.module';

import { MenuAlumnoPage } from './menu-alumno.page';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuAlumnoPageRoutingModule
  ],
  declarations: [MenuAlumnoPage, BarcodeScanningModalComponent]
})
export class MenuAlumnoPageModule {}
