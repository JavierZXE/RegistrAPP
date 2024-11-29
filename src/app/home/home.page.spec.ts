import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { AuthService } from '../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { IonInput } from '@ionic/angular';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomePage', () => {
  let componente: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authServiceMock: any;
  let alertControllerMock: any;
  let navCtrlMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);
    navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: NavController, useValue: navCtrlMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    componente = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('presentAlert', () => {
    it('debería mostrar una alerta con el mensaje correcto', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await componente.presentAlert('Header', 'Message');

      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: 'Header',
        message: 'Message',
        buttons: ['Entendido']
      });
      expect(alertSpy.present).toHaveBeenCalled();
    });
  });

  describe('restablecerPwd', () => {
    it('debería mostrar la alerta de restablecer contraseña', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await componente.restablecerPwd();

      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: "Recuperar Contraseña",
        subHeader: "Verifica tu Correo",
        message: "Se ha enviado un correo a la dirección proporcionada para restablecer la contraseña del usuario mencionado.",
        buttons: ['Entendido']
      });
      expect(alertSpy.present).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('debería mostrar alerta si el nombre de usuario está vacío', async () => {
      componente.username = '';
      componente.password = 'password123';
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await componente.login();

      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: 'Campo vacío',
        message: 'Por favor, ingresa tu usuario.',
        buttons: ['Entendido']
      });
      expect(alertSpy.present).toHaveBeenCalled();
    });

    it('debería mostrar alerta si la contraseña está vacía', async () => {
      componente.username = 'testuser';
      componente.password = '';
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await componente.login();

      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: 'Campo vacío',
        message: 'Por favor, ingresa tu contraseña.',
        buttons: ['Entendido']
      });
      expect(alertSpy.present).toHaveBeenCalled();
    });

    it('debería hacer login exitoso y navegar a la página correcta si las credenciales son correctas', async () => {
      componente.username = 'testuser';
      componente.password = 'password123';
      const userMock = { id: '1', tipo: 'alumno' };
      authServiceMock.login.and.returnValue(Promise.resolve(userMock));

      await componente.login();

      expect(authServiceMock.login).toHaveBeenCalledWith('testuser', 'password123', true);
      expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(userMock));
      expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('/menu-alumno');
    });

    it('debería mostrar un mensaje de error si las credenciales son incorrectas', async () => {
      componente.username = 'testuser';
      componente.password = 'wrongpassword';
      authServiceMock.login.and.returnValue(Promise.resolve(null));

      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await componente.login();

      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos',
        buttons: ['Entendido']
      });
      expect(alertSpy.present).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('debería redirigir al menú adecuado si el usuario ya está logueado', () => {
      const userMock = { tipo: 'alumno' };
      localStorage.setItem('currentUser', JSON.stringify(userMock));

      componente.ngOnInit();

      expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('/menu-alumno');
    });

    it('debería redirigir al menú de profesor si el usuario es un profesor', () => {
      const userMock = { tipo: 'profesor' };
      localStorage.setItem('currentUser', JSON.stringify(userMock));

      componente.ngOnInit();

      expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('/menu-profesor');
    });
  });
});
