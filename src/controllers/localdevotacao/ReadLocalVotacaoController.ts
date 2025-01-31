import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class Readlocalvotacaocontroller {
  async seachLocalVotacaoUf(req: Request, res: Response) {
    const { uf } = req.body
    const usuariouuid = req.uuid
    const usuario = await prismaClient.usuario.findUnique({
      where: {
        uuid: usuariouuid
      }, include: {
        coligacao: true
      },
    })
    if (usuario == null) {
      return res.status(401).json({ Message: "Usuario nao encontrado" })
    }
    try {
      if (usuario.perfil == 4 && usuario.coligacao != null) {
        const locaisVotacao = await prismaClient.enderecoLocalVotacao.findMany({
          where: {
            uf: uf,

          },
          include: {
            LocalVotacao: {
              include: {
                Eleitor: {
                  where: {
                    coligacao: {
                      usuarioUuid: usuario.uuid,
                    }
                  }
                },

                sessoesEleitorais: true,
                endereco: true,
              }
            }
          }
        })
        return res.status(200).json(locaisVotacao)
      }
      if (usuario.perfil == 2 || usuario.perfil == 1) {
        const locaisVotacao = await prismaClient.enderecoLocalVotacao.findMany({
          where: {
            uf: uf,
          },
          include: {
            LocalVotacao: {
              include: {
                Eleitor: {
                  where: {
                    candidatoUuid: usuario.uuidCandidato
                  }
                },

                sessoesEleitorais: true,
                endereco: true,
              }
            }
          }
        })
        return res.status(200).json(locaisVotacao)
      }

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: 'Falha Interna do Servidor'
      })
    }
  }
  async seachLocalVotacaoonlyUf(req: Request, res: Response) {
    const { uf } = req.body
    const usuariouuid = req.uuid
    const usuario = await prismaClient.usuario.findUnique({
      where: {
        uuid: usuariouuid
      }, include: {
        coligacao: true
      },
    })
    if (usuario == null) {
      return res.status(401).json({ Message: "Usuario nao encontrado" })
    }
    try {
      if (usuario.perfil == 4 && usuario.coligacao != null) {
        const locaisVotacao = await prismaClient.enderecoLocalVotacao.findMany({
          where: {
            uf: uf,
          },
          include: {
            LocalVotacao: {
              include: {
                sessoesEleitorais: true,
                endereco: true,
              }
            }
          }
        })
        return res.status(200).json(locaisVotacao)
      }
      if (usuario.perfil == 2 || usuario.perfil == 1) {
        const locaisVotacao = await prismaClient.enderecoLocalVotacao.findMany({
          where: {
            uf: uf,
          },
          include: {
            LocalVotacao: {
              include: {
                sessoesEleitorais: true,
                endereco: true,
              }
            }
          }
        })
        return res.status(200).json(locaisVotacao)
      }

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: 'Falha Interna do Servidor'
      })
    }
  }
  async seachLocalVotacaoWEBUf(req: Request, res: Response) {
    const { uf } = req.query
    try {
      const locaisVotacao = await prismaClient.enderecoLocalVotacao.findMany({
        where: {
          uf: 'PA'
        },
        include: {
          LocalVotacao: {
            include: {
              _count: true,
              Eleitor: {
                select: {
                  _count: true
                }
              },
              sessoesEleitorais: true,
              endereco: true,
            },
          }
        }
      })
      return res.status(200).json(locaisVotacao)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: 'Falha Interna do Servidor'
      })
    }
  }
  async searchLocalVotacaoonly(req: Request, res: Response) {
    try {
      const locaisVotacao = await prismaClient.localVotacao.findMany({})
      return res.status(200).json(locaisVotacao)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: error,
        message: 'Falha Interna do Servidor'
      })
    }
  }
}