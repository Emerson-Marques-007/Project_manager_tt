/** Erro com status HTTP e mensagem segura para o usuário final. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Responde a qualquer erro capturado num handler.
 * HttpError devolve a mensagem própria; qualquer outro erro vira 500 genérico
 * (o detalhe vai só para o log do servidor, para não vazar informação do banco).
 */
export function sendError(response, error) {
  if (error instanceof HttpError) {
    return response.status(error.status).json({ ok: false, erro: error.message });
  }
  console.error(error);
  return response.status(500).json({ ok: false, erro: 'Erro interno do servidor.' });
}
