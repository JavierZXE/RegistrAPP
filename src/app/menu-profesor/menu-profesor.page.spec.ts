import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuProfesorPage } from './menu-profesor.page';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('MenuProfesorPage', () => {
  let component: MenuProfesorPage;
  let fixture: ComponentFixture<MenuProfesorPage>;
  let authServiceMock: any;
  let alertControllerMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [MenuProfesorPage],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertController, useValue: alertControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuProfesorPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('logOutAlumno', () => {
    it('debería mostrar un mensaje de confirmación para cerrar sesión', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await component.logOutAlumno();

      expect(alertSpy.present).toHaveBeenCalled();
    });

    it('debería llamar a authService.logout y redirigir a home cuando se confirma el cierre de sesión', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await component.logOutAlumno();
      const handler = alertSpy.buttons[1].handler; // El handler de "Cerrar sesión"
      handler();

      expect(authServiceMock.logout).toHaveBeenCalled();
    });
  });
});
