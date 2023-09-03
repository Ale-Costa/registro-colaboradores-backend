import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ColaboradorDTO } from 'src/modules/colaborador/models/colaborador.dto';
import { ColaboradorService } from '../services/colaborador.service';

@Controller('colaborador')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  @Get()
  async buscarColaboradores(): Promise<ColaboradorDTO[]> {
    return this.colaboradorService.buscarColaboradores();
  }

  
  @Get('/pesquisar/:nome?')
  async buscarPorNome(@Param('nome') nome?: string): Promise<ColaboradorDTO[]> {
    return this.colaboradorService.buscarColaboradorPorNome(nome);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: number): Promise<ColaboradorDTO> {
    return this.colaboradorService.buscarColaraboradorPorId(Number(id));
  }

  @Post('/registrar')
  async registrar(@Body() body: ColaboradorDTO): Promise<ColaboradorDTO> {
    return this.colaboradorService.registrar(body);
  }

  @Put('/validar/:id')
  async validar(@Param('id') id: string): Promise<ColaboradorDTO> {
    return this.colaboradorService.validar(Number(id));
  }

  @Put('/invalidar/:id')
  async invalidar(@Param('id') id: string): Promise<ColaboradorDTO> {
    return this.colaboradorService.invalidar(Number(id));
  }
}
