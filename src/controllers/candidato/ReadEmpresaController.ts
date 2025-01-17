import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';

export class ReadEmpresaController {

  async getCandidatos(req: Request, res: Response) {

    try {

      const empresas = await prismaClient.candidato.findMany({
        select: {
          uuid: true,
          nomeCandidato: true,
        }
      })

      return res.status(200).json(empresas)

    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'Erro ao procurar colaboradores'
      })
    }
  }
  async getCandidatosColigacaoAno(req: Request, res: Response) {
    const uuidusuario = req.uuid
    try {
      const usuario = await prismaClient.usuario.findUnique({
        where: {
          uuid: uuidusuario,

        },
        include: {
          candidato:true,
          coligacao: {
            where: {
              ano: 2024
            },
  
         
          }
        }
      })
      if (usuario?.perfil == 4|| usuario?.perfil==5) {
        const candiatos = await prismaClient.coligacao.findMany({
          where: {
            uuid: usuario.candidato.coligacaoUuid!
          },
          include: {
            Candidatos: {
              include: {
                Eleitor:true,
                Usuario: {
                  include: {
                    contato: true,
                  }
                }
              }
            }
          }
        })
        res.status(200).json(candiatos[0].Candidatos)
      } else {
        return res.status(401).json({
          message: "Acesso não autorizado"
        })
      }



    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: 'Erro ao procurar candidatos'
      })
    }
  }

}
