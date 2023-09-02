import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ColaboradorDTO {
  id?: number;

  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser uma string' })
  nome: string;

  @IsNotEmpty({ message: 'email não pode ser vazio' })
  @IsString({ message: 'email deve ser uma string' })
  email: string;

  @IsNotEmpty({ message: 'cpf não pode ser vazio' })
  @IsString({ message: 'cpf deve ser uma string' })
  cpf: string;

  @IsOptional()
  @IsString({ message: 'telefone deve ser uma string' })
  telefone?: string;

  @IsNotEmpty({ message: 'conhecimentos não pode ser vazio' })
  @IsArray({ message: 'conhecimentos deve ser uma lista' })
  @IsString({
    message: 'conhecimentos deve ser uma lista de string',
    each: true,
  })
  conhecimentos: string[];

  @IsOptional()
  @IsBoolean({ message: 'Validado deve ser um booleano' })
  validado?: boolean;
}
