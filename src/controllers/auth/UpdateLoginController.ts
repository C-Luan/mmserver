import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import { hash } from 'bcryptjs';

export class UpdateLoginController {

  async update(req: Request, res: Response) {
    const { email, senha } = req.body
    const hash_senha = await hash(senha, 12)
    const { Usuario_uuid } = req.params


    try {
      const loginAtualizado = await prismaClient.login.update(
        {
          where: { Usuario_uuid, email },
          data: {
            email,
            senha: hash_senha
          }
        }
      )
      return res.status(200).json(loginAtualizado)

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: "Erro ao atualizar login"
      })
    }
  }
}