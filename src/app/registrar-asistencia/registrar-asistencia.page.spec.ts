import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarAsistenciaPage } from './registrar-asistencia.page';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('RegistrarAsistenciaPage', () => {
  let component: RegistrarAsistenciaPage;
  let fixture: ComponentFixture<RegistrarAsistenciaPage>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getTeacherSubjects', 'getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [RegistrarAsistenciaPage],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarAsistenciaPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería obtener las asignaturas del profesor correctamente', async () => {
      const asignaturasMock = [{ id: '1', nombre: 'Matemáticas' }];
      authServiceMock.getTeacherSubjects.and.returnValue(Promise.resolve(asignaturasMock));

      await component.ngOnInit();

      expect(component.secciones).toEqual(asignaturasMock);
    });

    it('debería manejar errores al obtener las asignaturas del profesor', async () => {
      authServiceMock.getTeacherSubjects.and.returnValue(Promise.reject('Error al obtener asignaturas'));

      await component.ngOnInit();

      expect(component.secciones).toEqual([]);
    });
  });

  describe('onSectionChange', () => {
    it('debería generar el valor del QR correctamente', () => {
      component.selectedSection = 'Matemáticas';
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

      component.onSectionChange();

      expect(component.qrValue).toBe(`${component.selectedSection}|${formattedDate}`);
    });
  });

  describe('onRangeChange', () => {
    it('debería actualizar el tamaño del QR', () => {
      component.onRangeChange({ detail: { value: 400 } });

      expect(component.qrSize).toBe(400);
    });
  });
});
