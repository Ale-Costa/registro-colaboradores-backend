import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ColaboradorService } from './colaborador.service';
import { ColaboradorDTO } from 'src/modules/colaborador/colaborador.dto';

@Controller('colaborador')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  @Get()
  async buscarColaboradores(): Promise<ColaboradorDTO[]> {
    return this.colaboradorService.buscarColaboradores();
  }

  @Post('/registrar')
  async registrar(@Body() body: ColaboradorDTO): Promise<ColaboradorDTO> {
    return this.colaboradorService.registrar(body);
  }

  @Put('/validar/:id')
  async validar(@Param('id') id: number): Promise<ColaboradorDTO> {
    return this.colaboradorService.validar(id);
  }
}
