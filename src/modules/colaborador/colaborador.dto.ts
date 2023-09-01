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

  @IsNotEmpty({ message: 'E-mail não pode ser vazio' })
  @IsString({ message: 'E-mail deve ser uma string' })
  email: string;

  @IsNotEmpty({ message: 'CPF não pode ser vazio' })
  @IsString({ message: 'CPF deve ser uma string' })
  cpf: string;

  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  telefone?: string;

  @IsNotEmpty({ message: 'Conhecimentos não pode ser vazio' })
  @IsArray({ message: 'Conhecimentos deve ser uma lista' })
  @IsString({
    message: 'Conhecimentos deve ser uma lista de string',
    each: true,
  })
  conhecimentos: string[];

  @IsOptional()
  @IsBoolean({ message: 'Validado deve ser um booleano' })
  validado?: boolean;
}
