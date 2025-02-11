import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';

export class UpdateColaboradorController {

  async update(req: Request, res: Response) {
    const { rSocial, cnpj, nomeCandidato, iEstadual, cep, pais, estado, cidade, bairro, rua, endereco, } = req.body
    const { uuid } = req.params

    try {
      const colaboradorAtualizado = await prismaClient.candidato.update(
        {
          where: { uuid },
          data: {
            nomeCandidato,
          }
        }
      )
      return res.status(200).json(colaboradorAtualizado)

    } catch (error) {
      return res.status(400).json({
        error: error,
        message: 'Erro ao atualizar colaborador'
      })
    }
  }


}