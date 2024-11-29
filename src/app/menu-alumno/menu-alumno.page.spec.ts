import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuAlumnoPage } from './menu-alumno.page';
import { AuthService } from '../services/auth.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('MenuAlumnoPage', () => {
  let component: MenuAlumnoPage;
  let fixture: ComponentFixture<MenuAlumnoPage>;
  let authServiceMock: any;
  let alertControllerMock: any;
  let modalControllerMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'alumnoPerteneceASeccion',
      'getAsistenciasAlumno',
      'addAsistencia',
      'logout'
    ]);
    alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);
    modalControllerMock = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [MenuAlumnoPage],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: ModalController, useValue: modalControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuAlumnoPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('startScan', () => {
    it('debería registrar la asistencia si el código es válido', async () => {
      const barcodeData = { barcode: { displayValue: '12345|2024-11-28' } };
      modalControllerMock.create.and.returnValue(Promise.resolve({ onWillDismiss: () => Promise.resolve({ data: barcodeData }) }));

      authServiceMock.alumnoPerteneceASeccion.and.returnValue(Promise.resolve(true));
      authServiceMock.getAsistenciasAlumno.and.returnValue(of([]));
      authServiceMock.addAsistencia.and.returnValue(of({}));

      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await component.startScan();

      expect(alertSpy.present).toHaveBeenCalledWith();
    });

    it('debería mostrar un mensaje de error si el escaneo falla', async () => {
      const barcodeData = null;
      modalControllerMock.create.and.returnValue(Promise.resolve({ onWillDismiss: () => Promise.resolve({ data: barcodeData }) }));

      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await component.startScan();

      expect(alertSpy.present).toHaveBeenCalledWith();
    });
  });

  describe('registrarAsistenciaConCodigo', () => {
    it('debería mostrar un error si el alumno no pertenece a la sección', async () => {
      authServiceMock.alumnoPerteneceASeccion.and.returnValue(Promise.resolve(false));

      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerMock.create.and.returnValue(Promise.resolve(alertSpy));

      await component.registrarAsistenciaConCodigo('12345|2024-11-28');

      expect(alertSpy.present).toHaveBeenCalledWith();
    });
  });
});
