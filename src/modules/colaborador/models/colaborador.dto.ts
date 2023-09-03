import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ColaboradorDTO {
  id?: number;

  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'email não pode ser vazio' })
  @IsString({ message: 'email deve ser uma string' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email: string;

  @IsNotEmpty({ message: 'cpf não pode ser vazio' })
  @IsString({ message: 'cpf deve ser uma string' })
  cpf: string;

  @IsOptional()
  @IsString({ message: 'celular deve ser uma string' })
  celular?: string;

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
