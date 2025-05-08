import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { prismaClient } from "../database/prismaClient";

type TokenPayload = {
  uuid: string;
  iat: number;
  exp: number;
};

export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Primeiro tenta pegar o token do cabeçalho Authorization
  const { authorization } = req.headers;
  
  let token: string | null = null;

  // Verifica se o token está no cabeçalho Authorization
  if (authorization) {
    const [, bearerToken] = authorization.split(" ");
    token = bearerToken;
  } 
  
  // Se o token não foi encontrado no cabeçalho, tenta pegar da query string
  if (!token) {
    const tokenQuery = req.query.token as string;
    if (tokenQuery) {
      token = tokenQuery;
    }
  }

  // Se não encontrar o token nem no cabeçalho nem na query string, retorna erro
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // Verificando se o token está na blacklist
    const tokenExpirado = await prismaClient.blacklist.findUnique({ where: { tokenexpirado: token } });

    if (tokenExpirado) {
      return res.status(401).json({ error: "Token expirado" });
    }

    // Verificando o token
    const tokenDecodificado = verify(token, process.env.SECRET ?? "") as TokenPayload;
    const { uuid } = tokenDecodificado;

    // Buscando o usuário no banco de dados
    const colaborador = await prismaClient.usuario.findUnique({ where: { uuid } });

    if (!colaborador) {
      return res.status(401).json({ error: "Usuário inválido" });
    }

    // Adicionando o UUID ao objeto de requisição para uso posterior
    (req as any).uuid = uuid;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
