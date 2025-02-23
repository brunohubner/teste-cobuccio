import { ApiResponseOptions } from '@nestjs/swagger';
import { ApiResponseErrorSwagger } from '../swagger/api-response-error.swagger';

export const API_RESPONSES: Record<string, ApiResponseOptions> = Object.freeze({
  BAD_REQUEST: {
    status: 400,
    description: 'Parâmetros inválidos',
    type: ApiResponseErrorSwagger,
  },
  UNAUTHORIZED: {
    status: 401,
    description: 'Acesso não autorizado',
    type: ApiResponseErrorSwagger,
  },
  FORBIDDEN: {
    status: 403,
    description: 'Acesso negado',
    type: ApiResponseErrorSwagger,
  },
  NOT_FOUND: {
    status: 404,
    description: 'Recurso não encontrado',
    type: ApiResponseErrorSwagger,
  },
  UNPROCESSABLE_ENTITY: {
    status: 422,
    description: 'Parâmetros inválidos. Verificar erro na resposta',
    type: ApiResponseErrorSwagger,
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    description: 'Erro interno do servidor',
    type: ApiResponseErrorSwagger,
  },
});
