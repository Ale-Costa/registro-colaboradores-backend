import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/primaService';
import { ColaboradorDTO } from '../models/colaborador.dto';

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

    return await this.prismaService.colaborador.create({
      data,
    });
  }

  async buscarColaboradores(): Promise<ColaboradorDTO[]> {
    return await this.prismaService.colaborador.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async buscarColaboradorPorNome(nome: string): Promise<ColaboradorDTO[]> {
    return await this.prismaService.colaborador.findMany({
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

  async buscarColaboradorPorId(id: number): Promise<ColaboradorDTO> {
    try{
      return await this.prismaService.colaborador.findUnique({
        where: {
          id,
        },
      });
    }catch{
      throw new NotFoundException();
  }}

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

    return await this.prismaService.colaborador.update({
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

    return await this.prismaService.colaborador.update({
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
