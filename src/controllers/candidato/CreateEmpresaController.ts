import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import { hash } from 'bcryptjs';

export class CreateEmpresaController {
  async handle(req: Request, res: Response) {
    const { v4: uuidv4 } = require('uuid');
    const { auth } = req.params
    try {

      const { nomeCandidato, apelido, cep, pais, estado, cidade, bairro, rua, endereco, emailLogin, senhaLogin
      } = req.body
      const hash_senha = await hash(senhaLogin, 12)
        const empresa = await prismaClient.candidato.create({
          data: {
            nomeCandidato: nomeCandidato,
            Usuario: {
              create: {
                login: {
                  create: {
                    autorizado: true,
                    email: emailLogin,
                    senha: hash_senha
                  }
                },
                nomeCompleto: nomeCandidato,
                apelido: apelido,
                perfil: 1
              }
            }

          }
        })
        return res.status(200).json(empresa)

    }
    catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: 'erro ao criar Empresa'
      })
    }
  }
}