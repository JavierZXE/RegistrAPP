import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsistenciasAlumnosPage } from './asistencias-alumnos.page';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';

describe('AsistenciasAlumnosPage', () => {
  let componente: AsistenciasAlumnosPage;
  let fixture: ComponentFixture<AsistenciasAlumnosPage>;
  let authServiceMock: any;

  const mockAsistencias = [
    {
      id: '1',
      alumno_id: '1',
      nombre_asignatura: 'Estadística Descriptiva',
      codigo_seccion: 'MAT4140_002',
      asistencias: [
        { fecha: '24/11/2024', estado: 'presente' },
        { fecha: '25/11/2024', estado: 'ausente' },
      ]
    },
    {
      id: '2',
      alumno_id: '1',
      nombre_asignatura: 'Física Avanzada',
      codigo_seccion: 'FIS3150_001',
      asistencias: [
        { fecha: '24/11/2024', estado: 'presente' },
        { fecha: '25/11/2024', estado: 'presente' },
      ]
    }
  ];

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAsistenciasByAlumnoId', 'getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [AsistenciasAlumnosPage],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenciasAlumnosPage);
    componente = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería obtener las asistencias correctamente', () => {
      // Simula la respuesta del servicio
      authServiceMock.getAsistenciasByAlumnoId.and.returnValue(of(mockAsistencias));

      // Llama al ngOnInit
      componente.ngOnInit();

      // Verifica que las asistencias se hayan asignado correctamente
      expect(componente.asistencias).toEqual(mockAsistencias);
      expect(authServiceMock.getAsistenciasByAlumnoId).toHaveBeenCalled();
    });

    it('debería manejar los errores al obtener las asistencias', () => {
      const errorResponse = 'Error al obtener asistencias';
      authServiceMock.getAsistenciasByAlumnoId.and.returnValue(throwError(errorResponse));
      spyOn(console, 'error');

      // Llama al ngOnInit
      componente.ngOnInit();

      // Verifica que se ha capturado el error correctamente
      expect(console.error).toHaveBeenCalledWith('Error al obtener asistencias:', errorResponse);
      expect(componente.asistencias).toEqual([]); // Las asistencias deben estar vacías en caso de error
    });

    it('debería verificar que el servicio getCurrentUser fue llamado', () => {
      authServiceMock.getCurrentUser.and.returnValue({ id: '1', nombre: 'Carlos' });
      spyOn(console, 'log');

      // Llama al ngOnInit
      componente.ngOnInit();

      // Verifica que getCurrentUser ha sido llamado
      expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith({ id: '1', nombre: 'Carlos' });
    });
  });
});
