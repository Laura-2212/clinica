import { NextResponse } from 'next/server';

export function respondWithApiError(error) {
  console.error('erro na API:', error);

  const isClientError = ['ValidationError', 'CastError'].includes(error?.name);
  const message = isClientError
    ? error.message
    : 'Não foi possível concluir a operação. Verifique a conexão com o banco de dados.';

  return NextResponse.json({ error: message }, { status: isClientError ? 400 : 500 });
}
