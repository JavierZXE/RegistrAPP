import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarClavePage } from './cambiar-clave.page';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('CambiarClavePage', () => {
  let componente: CambiarClavePage;
  let fixture: ComponentFixture<CambiarClavePage>;
  let authServiceMock: any;
  let alertControllerMock: any;
  let routerMock: any;

  const mockCurrentUser = {
    id: '1',
    nombre: 'Carlos',
    apellidos: 'López',
    correo: 'carlos.lopez@example.com',
    contraseña: 'securepass1'
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUserPassword', 'logout']);
    alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CambiarClavePage],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarClavePage);
    componente = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('cambiarClave', () => {
    it('debería cambiar la contraseña si la antigua es correcta y las nuevas coinciden', async () => {
      authServiceMock.getCurrentUser.and.returnValue(mockCurrentUser);
      alertControllerMock.create.and.returnValue(Promise.resolve({
        present: jasmine.createSpy('present')
      } as any));
      
      componente.claveAntigua = 'securepass1';
      componente.claveNueva = 'newpassword123';
      componente.confirmarClaveNueva = 'newpassword123';

      // Ejecutar cambiarClave
      await componente.cambiarClave();

      // Verificar que la contraseña se actualizó
      expect(authServiceMock.updateUserPassword).toHaveBeenCalledWith({
        ...mockCurrentUser,
        contraseña: 'newpassword123'
      });

      // Verificar que se mostró la alerta de éxito
      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: 'Éxito',
        message: 'Contraseña actualizada correctamente.',
        buttons: ['OK']
      });

      // Verificar que se navega al home después de cambiar la contraseña
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('debería mostrar un mensaje de error si la nueva clave y la confirmación no coinciden', async () => {
      authServiceMock.getCurrentUser.and.returnValue(mockCurrentUser);
      alertControllerMock.create.and.returnValue(Promise.resolve({
        present: jasmine.createSpy('present')
      } as any));

      componente.claveAntigua = 'securepass1';
      componente.claveNueva = 'newpassword123';
      componente.confirmarClaveNueva = 'wrongpassword123';

      // Ejecutar cambiarClave
      await componente.cambiarClave();

      // Verificar que no se actualizó la contraseña
      expect(authServiceMock.updateUserPassword).not.toHaveBeenCalled();

      // Verificar que se mostró la alerta de error
      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: 'Error',
        message: 'La nueva clave y la confirmación no coinciden.',
        buttons: ['OK']
      });
    });

    it('debería mostrar un mensaje de error si la clave antigua es incorrecta', async () => {
      authServiceMock.getCurrentUser.and.returnValue(mockCurrentUser);
      alertControllerMock.create.and.returnValue(Promise.resolve({
        present: jasmine.createSpy('present')
      } as any));

      componente.claveAntigua = 'wrongpassword';
      componente.claveNueva = 'newpassword123';
      componente.confirmarClaveNueva = 'newpassword123';

      // Ejecutar cambiarClave
      await componente.cambiarClave();

      // Verificar que no se actualizó la contraseña
      expect(authServiceMock.updateUserPassword).not.toHaveBeenCalled();

      // Verificar que se mostró la alerta de error
      expect(alertControllerMock.create).toHaveBeenCalledWith({
        header: 'Error',
        message: 'Ingrese su clave antigua.',
        buttons: ['OK']
      });
    });
  });
});
