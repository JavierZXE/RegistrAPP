import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignaturasAlumnosPage } from './asignaturas-alumnos.page';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';

describe('AsignaturasAlumnosPage', () => {
  let componente: AsignaturasAlumnosPage;
  let fixture: ComponentFixture<AsignaturasAlumnosPage>;
  let authServiceMock: any;

  // Datos simulados
  const mockStudentId = '1'; // Alumno Carlos López
  const mockSubjectCodes = ['MAT4140_002', 'FIS3150_001'];
  const mockSubjectDetails = [
    {
      id: 'MAT4140',
      nombre: 'Matemáticas Avanzadas',
      secciones: [
        {
          codigo_seccion: 'MAT4140_001',
          profesor_id: '3',
          alumnos_inscritos: ['3', '4'],
        },
        {
          codigo_seccion: 'MAT4140_002',
          profesor_id: '1',
          alumnos_inscritos: ['1'], // Alumno Carlos López
        },
        {
          codigo_seccion: 'MAT4140_003',
          profesor_id: '2',
          alumnos_inscritos: ['2', '5'],
        },
      ],
    },
    {
      id: 'FIS3150',
      nombre: 'Física Avanzada',
      secciones: [
        {
          codigo_seccion: 'FIS3150_001',
          profesor_id: '1',
          alumnos_inscritos: ['1', '4'], // Alumno Carlos López
        },
        {
          codigo_seccion: 'FIS3150_002',
          profesor_id: '2',
          alumnos_inscritos: ['2', '5'],
        },
      ],
    },
  ];

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'getStudentSubjects',
      'getSubjectDetails'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AsignaturasAlumnosPage],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsignaturasAlumnosPage);
    componente = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('getUserId', () => {
    it('debería devolver el ID del usuario si existe', () => {
      authServiceMock.getCurrentUser.and.returnValue({ id: '1' });
      expect(componente['getUserId']()).toBe('1');
    });

    it('debería devolver una cadena vacía si el usuario no existe', () => {
      authServiceMock.getCurrentUser.and.returnValue(null);
      expect(componente['getUserId']()).toBe('');
    });
  });

  describe('ngOnInit', () => {
    it('debería obtener y procesar correctamente las asignaturas', async () => {
      // Mock de los códigos de asignaturas
      authServiceMock.getStudentSubjects.and.returnValue(of(mockSubjectCodes).toPromise());
      
      // Mock de los detalles de asignaturas
      authServiceMock.getSubjectDetails.and.callFake((codigo: string) =>
        of(mockSubjectDetails.find(a => a.id === codigo)).toPromise()
      );

      // Llamada al método ngOnInit
      await componente.ngOnInit();

      // Verificamos que el servicio se haya llamado correctamente
      expect(authServiceMock.getStudentSubjects).toHaveBeenCalledWith('1');
      expect(authServiceMock.getSubjectDetails).toHaveBeenCalledTimes(2);
      
      // Verificamos que los detalles de las asignaturas estén filtrados correctamente
      expect(componente.subjectsWithDetails).toEqual([
        {
          id: 'MAT4140',
          nombre: 'Matemáticas Avanzadas',
          secciones: [
            {
              codigo_seccion: 'MAT4140_002',
              profesor_id: '1',
              alumnos_inscritos: ['1']
            }
          ]
        },
        {
          id: 'FIS3150',
          nombre: 'Física Avanzada',
          secciones: [
            {
              codigo_seccion: 'FIS3150_001',
              profesor_id: '1',
              alumnos_inscritos: ['1', '4']
            }
          ]
        }
      ]);
    });

    it('debería manejar el caso cuando no se encuentran asignaturas', async () => {
      authServiceMock.getStudentSubjects.and.returnValue(of([]).toPromise());
      spyOn(console, 'warn');

      await componente.ngOnInit();

      expect(console.warn).toHaveBeenCalledWith('No se encontraron asignaturas para este estudiante.');
      expect(componente.subjectsWithDetails).toEqual([]);
    });

    it('debería manejar los errores correctamente', async () => {
      authServiceMock.getStudentSubjects.and.returnValue(Promise.reject('Error de red'));
      spyOn(console, 'error');

      await componente.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error al obtener los detalles de las asignaturas', 'Error de red');
      expect(componente.subjectsWithDetails).toEqual([]);
    });
  });
});
