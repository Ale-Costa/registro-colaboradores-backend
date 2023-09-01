import { Module } from '@nestjs/common';
import { ColaboradorModule } from './modules/colaborador/colaborador.module';

@Module({
  imports: [ColaboradorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
