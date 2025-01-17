import { Request, Response} from 'express';
import { prismaClient } from '../../database/prismaClient';

export class DeleteColaboradorController {

  async delete(req: Request, res: Response) {
    
    const {uuid} = req.params

    try {

      await prismaClient.candidato.delete(
        {
          where: {
            uuid
          }
        }
      )

      return res.status(200).json({message: "Empresa deletada"})

    } catch (error) {
      return res.status(400).json({
        error: error,
        message: 'Erro ao deletar uma Empresa'
      })
    }
  }
}
