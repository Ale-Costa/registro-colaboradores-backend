/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/primaService';
import { ColaboradorDTO } from 'src/modules/colaborador/models/colaborador.dto';

@Injectable()
export class ColaboradorService {
  constructor(private readonly prismaService: PrismaService) {}

  async registrar(data: ColaboradorDTO): Promise<ColaboradorDTO> {
    const colaboradorCadastrado =
      await this.prismaService.colaborador.findUnique({
        where: {
          cpf: data.cpf,
        },
      });

    if (colaboradorCadastrado) {
      throw new HttpException(
        'Colaborador já cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const colaborador = await this.prismaService.colaborador.create({
      data,
    });

    return colaborador;
  }

  async buscarColaboradores(): Promise<ColaboradorDTO[]> {
    return this.prismaService.colaborador.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async buscarColaboradorPorNome(nome: string): Promise<ColaboradorDTO[]> {
    if (!nome) {
      return this.buscarColaboradores();
    }
    return this.prismaService.colaborador.findMany({
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
  }

  async buscarColaraboradorPorId(id: number): Promise<ColaboradorDTO> {
    return this.prismaService.colaborador.findUnique({
      where: {
        id,
      },
    });
  }

  async validar(id: number): Promise<ColaboradorDTO> {
    const colaboradorExiste = await this.prismaService.colaborador.findUnique({
      where: {
        id,
      },
    });

    if (!colaboradorExiste) {
      throw new HttpException(
        'Colaborador não cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prismaService.colaborador.update({
      where: {
        id,
      },
      data: {
        validado: true,
        dataValidacao: new Date(),
      },
    });
  }

  async invalidar(id: number): Promise<ColaboradorDTO> {
    const colaboradorExiste = await this.prismaService.colaborador.findUnique({
      where: {
        id,
      },
    });

    if (!colaboradorExiste) {
      throw new HttpException(
        'Colaborador não cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prismaService.colaborador.update({
      where: {
        id,
      },
      data: {
        validado: false,
        dataValidacao: new Date(),
      },
    });
  }
}
