import { Test, TestingModule } from '@nestjs/testing';
import { ColaboradorService } from './colaborador.service';
import { PrismaService } from '../../../database/primaService';
import { ColaboradorDTO } from '../models/colaborador.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BehaviorSubject, async } from 'rxjs';

describe('ColaboradorService', () => {
  let service: ColaboradorService;

  const fakeColaboradores = [
    {
      id: 1,
      nome: 'Fulano',
      cpf: '12345678910',
      email: 'Fulano@exemplo.com',
      conhecimentos: ['Git', 'React'],
    },
    {
      id: 2,
      nome: 'Ciclano',
      cpf: '09876543210',
      email: 'Ciclano@exemplo.com',
      conhecimentos: ['Python', 'NodeJs'],
    },
    {
      id: 3,
      nome: 'Beltrano',
      cpf: '43567890110',
      email: 'Beltrano@exemplo.com',
      conhecimentos: ['Banco de dados', 'Git'],
    },
  ];

  const create$ = new BehaviorSubject<ColaboradorDTO>(null);
  const findUnique$ = new BehaviorSubject<ColaboradorDTO>(null);
  const findMany$ = new BehaviorSubject<ColaboradorDTO[]>(null);
  const update$ = new BehaviorSubject<ColaboradorDTO>(null);

  const prismaMock = {
    colaborador: {
      create: jest.fn().mockImplementation(() => create$.value),
      findUnique: jest.fn().mockImplementation(() => findUnique$.value),
      findMany: jest.fn().mockImplementation(() => findMany$.value),
      update: jest.fn().mockImplementation(() => update$.value),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColaboradorService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ColaboradorService>(ColaboradorService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Metodo: validar', () => {
    let response: ColaboradorDTO;
    let responseError: HttpException;
    const id = 3;

    beforeEach(async () => {
      try {
        response = await service.validar(id);
      } catch (error) {
        responseError = error;
      }
    });

    describe('Quando nao houver um colaborador cadastrado com o id informado', () => {
      beforeAll(() => {
        findUnique$.next(null);
      });

      it('Deve retornar erro de colaborador nao cadastrado', () => {
        expect(responseError).toBeInstanceOf(HttpException);
        expect(responseError.getResponse()).toEqual(
          'Colaborador não cadastrado',
        );
        expect(responseError.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Quando houver um colaborador cadastrado com o id informado', () => {
      beforeAll(() => {
        findUnique$.next(fakeColaboradores[0]);
        update$.next({ ...fakeColaboradores[0], validado: true });
      });

      it('Deve atualizar o colaborador', () => {
        expect(response).toEqual({ ...fakeColaboradores[0], validado: true });
        expect(prismaMock.colaborador.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.colaborador.update).toHaveBeenCalledWith({
          where: {
            id,
          },
          data: {
            validado: true,
            dataValidacao: expect.any(Date),
          },
        });
      });
    });
  });

  describe('Metodo: invalidar', () => {
    let response: ColaboradorDTO;
    let responseError: HttpException;
    const id = 3;

    beforeEach(async () => {
      try {
        response = await service.invalidar(id);
      } catch (error) {
        responseError = error;
      }
    });

    describe('Quando nao houver um colaborador cadastrado com o id informado', () => {

      beforeAll(() => {
        findUnique$.next(null);
      });
      it('Deve retornar erro de colaborador nao cadastrado', () => {
        expect(responseError).toBeInstanceOf(HttpException);
        expect(responseError.getResponse()).toEqual(
          'Colaborador não cadastrado',
        );
        expect(responseError.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Quando houver um colaborador cadastrado com o id informado', () => {
      beforeAll(() => {
        findUnique$.next(fakeColaboradores[0]);
        update$.next({ ...fakeColaboradores[0], validado: false });

      });

      it('Deve atualizar o colaborador', () => {
        expect(response).toEqual({ ...fakeColaboradores[0], validado: false });
        expect(prismaMock.colaborador.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.colaborador.update).toHaveBeenCalledWith({
          where: {
            id,
          },
          data: {
            validado: false,
            dataValidacao: expect.any(Date),
          },
        });
      });
    });
  });

  describe('Metodo: Registrar', () => {
    let response: ColaboradorDTO;
    let responseError: HttpException;
    const colaboradorNovo = {
      nome: 'Fulano',
      cpf: '18871823182',
      email: 'Fulano@exemplo.com',
      conhecimentos: ['Git', 'React'],
    };

    beforeEach(async () => {
      try {
        response = await service.registrar(colaboradorNovo);
      } catch (error) {
        responseError = error;
      }
    });

    describe('Quando o colaborador nao esta cadastrado', () => {
      beforeAll(() => {
        findUnique$.next(null);
        create$.next(colaboradorNovo);
      });

      it('Deve registrar colaborador', () => {
        expect(response).toEqual(colaboradorNovo);
        expect(prismaMock.colaborador.create).toHaveBeenCalledWith({
          data: colaboradorNovo,
        });
        expect(prismaMock.colaborador.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('Quando o colaborador ja esta cadastrado', () => {
      beforeAll(() => {
        findUnique$.next(fakeColaboradores[0]);
      });

      it('Deve retornar o erro de colaborador ja cadastrado', () => {
        expect(responseError).toBeInstanceOf(HttpException);
        expect(responseError.getResponse()).toEqual(
          'Colaborador já cadastrado',
        );
        expect(responseError.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('Metodo: buscarColaboradores', () => {
    let response;
    beforeEach(async () => {
      findMany$.next(fakeColaboradores);
      response = await service.buscarColaboradores();
    });

    it('Deve retornar os colaboradores cadastrados por ordem alfabetica', () => {
      expect(response).toEqual(fakeColaboradores);
      expect(prismaMock.colaborador.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.colaborador.findMany).toHaveBeenCalledWith({
        orderBy: {
          nome: 'asc',
        },
      });
    });
  });

  describe('Metodo: buscarColaboradorPorNome', () => {
    let response: ColaboradorDTO[];
    const nome = 'Fulano';
    beforeEach(async () => {
      findMany$.next([fakeColaboradores[1]]);
      response = await service.buscarColaboradorPorNome(nome);
    });

    it('Deve retornar os colaboradores que contem Fulano no nome', () => {
      expect(response).toEqual([fakeColaboradores[1]]);
      expect(prismaMock.colaborador.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.colaborador.findMany).toHaveBeenCalledWith({
        where: {
          nome: {
            contains: nome,
            mode: 'insensitive',
          },
        },
        orderBy: {
          nome: 'asc',
        },
      });
    });
  });

  describe('Metodo: buscarColaboradorPorId', () => {
    let response: ColaboradorDTO;
    let responseError: HttpException;
    const id = 3;
    beforeEach(async () => {
      try {
        response = await service.buscarColaboradorPorId(id);
      } catch (error) {
        responseError = error;
      }
    });

    describe('Quando o houver um colaborador registrado com o id informado', () => {
      beforeAll(() => {
        findUnique$.next(fakeColaboradores[2]);
      });

      it('Deve retornar o colaborador com o id correspondente', () => {
        expect(response).toEqual(fakeColaboradores[2]);
        expect(prismaMock.colaborador.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaMock.colaborador.findUnique).toHaveBeenCalledWith({
          where: {
            id,
          },
        });
      });
    });

    describe('Quando nao houver um colaborador registrado com o id informado	', () => {
      beforeAll(() => {
        findUnique$.error('');
      });

      it('Deve retornar erro de colaborador nao cadastrado', () => {
        expect(responseError).toBeInstanceOf(HttpException);
        expect(responseError.getResponse()).toEqual({
          message: 'Not Found',
          statusCode: 404,
        });
        expect(responseError.getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });


});
