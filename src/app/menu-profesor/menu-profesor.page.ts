import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-profesor',
  templateUrl: './menu-profesor.page.html',
  styleUrls: ['./menu-profesor.page.scss'],
})
export class MenuProfesorPage implements OnInit {
  welcomeMessage: string = '';
  constructor() {
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
  ngOnInit() {
  }
}
