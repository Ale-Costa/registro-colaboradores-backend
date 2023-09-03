import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/primaService';
import { ColaboradorController } from './controllers/colaborador.controller';
import { ColaboradorService } from './services/colaborador.service';

@Module({
  controllers: [ColaboradorController],
  providers: [ColaboradorService, PrismaService],
})
export class ColaboradorModule {}
