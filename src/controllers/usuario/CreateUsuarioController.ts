import { hash } from 'bcryptjs';
import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import { log } from 'console';

export class CreateUserController {
  async handle(req: Request, res: Response) {


    try {
      const { v4: uuidv4 } = require('uuid');
      const { nomeCompleto, uuidCandidato, coordenador, isAtivo, email, senha, apelido, perfil } = req.body
      const hash_senha = await hash(senha, 12)

      const colaborador = await prismaClient.usuario.create({
        data: {
          uuidCandidato: uuidCandidato,
          nomeCompleto: nomeCompleto,
          apelido: apelido,
          perfil: perfil,
          coordenador: coordenador,
          login: {
            create: {
              email: email.toLowerCase().trim(),
              senha: hash_senha,
              autorizado: true
            }
          },
        }
      })
      return res.status(200).json(colaborador)
    }
    catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: 'erro ao criar usuario'
      })
    }
  }
}