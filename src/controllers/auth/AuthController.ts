import { compare, } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import process from 'process';

export class AuthColaboradorController {
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body

      const login = await prismaClient.login.findUnique({
        where:
        {
          email
        },
        select: {
          senha: true,
          Usuario_uuid: true,
          Usuario: {
            select: {
              uuid: true,
              uuidCandidato: true,
              perfil: true,
              candidato: true,
            }
          }
        }
      })

      if (!login) {
        return res.json({ error: "login invalido (usuario invalido)" })
      }
      const senhaValida = await compare(senha, login.senha)
      if (!senhaValida) {
        return res.json({ error: "login invalido (senha invalida)" })
      }
      const token = sign({ uuid: login.Usuario_uuid }, process.env.SECRET ?? '', { expiresIn: "1h" })
      const { Usuario_uuid, Usuario, } = login
      return res.json({ login: { Usuario_uuid, Usuario, email }, token })
    }
    catch (err) {
      console.log(err)
      return res.json({ error: err })
    }
  }
}