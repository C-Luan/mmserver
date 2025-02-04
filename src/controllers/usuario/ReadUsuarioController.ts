import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';

export class ReadUserController {

  async colaboradoresCandidato(req: Request, res: Response) {
    const { uuid } = req.params
    try {
      console.log(uuid)
      const colaboradores = await prismaClient.usuario.findMany({
        orderBy: {
          nomeCompleto: 'asc'
        },
        where: {
          uuidCandidato: {
            equals: uuid
          }
        },

        include: {
          candidato: true,
          contato: true,
          EnderecoUsuario: true,
          Perfil: true,
          login: {
            select: {
              autorizado: true,
              email: true,
            }
          },
          Eleitor: {
            include: {
              EnderecoEleitor: true,
              candidato: true,
              classificacao: true,
              contatoEleitor: true,
              criado_por: true,
              sessaoeleitoral: true,
              MidiasSociaisEleitor: true,
              DadosPessoaisEleitor: true,
atendimento:true,

            }
          },
        }

      })

      return res.status(200).json(colaboradores)

    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'Erro ao procurar usuarios'
      })
    }
  }
  async colaboradoresCandidatoCoordenador(req: Request, res: Response) {
    const { uuid } = req.params
    try {

      const colaboradores = await prismaClient.usuario.findMany({
        orderBy: {
          nomeCompleto: 'asc'
        },
        where: {
          uuidCandidato: {
            equals: uuid
          },
          perfil: {
            in: [2, 5]
          }
        },

        include: {
          candidato: true,
          contato: true,
          EnderecoUsuario: true,
          login: {
            select: {
              autorizado: true,
              email: true,
            }
          },
          Perfil: true,
          Eleitor: {
            include: {
              EnderecoEleitor: true,
              candidato: true,
              classificacao: true,
              contatoEleitor: true,
              criado_por: true,
              sessaoeleitoral: true,
              MidiasSociaisEleitor: true,
              DadosPessoaisEleitor: true,

            }
          },
        }

      })

      return res.status(200).json(colaboradores)

    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'Erro ao procurar usuarios'
      })
    }
  }
  async colaborador(req: Request, res: Response) {
    const { uuid } = req.params
    try {
      const colaborador = await prismaClient.usuario.findUnique({

        where: {
          uuid
        },
        include: {
          candidato: true,
          contato: true,
          login: {
            select:{
              autorizado: true,
              email:true,
            }
          },
          EnderecoUsuario: true,
          Perfil: true,

        }
      })

      if (colaborador == null) {
        return res.status(404).json({ message: "Colaborador não encontrado" })
      }

      return res.status(200).json(colaborador)

    } catch (error) {
      return res.status(400).json({
        error: error,
        message: 'Colaborador não encontrado'
      })
    }
  }

  async cadastroEleitorUsuarioDia(req: Request, res: Response) {
    const dataString = req.query.data as string
    const uuid = req.uuid;
    const usuario = await prismaClient.usuario.findUnique({

      where: {
        uuid: uuid
      },
      include: {
        candidato: {
          include: {
            coligacao: true,
          }
        },
        coligacao: true
      }
    })

    try {
      if (dataString) {
        const now = new Date(dataString);
        if (usuario?.perfil == 4 && usuario.coligacao != null) {
          const colaborador = await prismaClient.usuario.findMany({
            orderBy: {
              uuidCandidato: 'asc'
            },
            where: {
              candidato: {
                coligacao: {
                  uuid: usuario?.candidato.coligacao?.uuid,
                }
              }
            },
            include: {
              candidato: true,
              Eleitor: {
                where: {
                  created_at: {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                  }
                },
              }
            }
          })
          return res.status(200).json(colaborador)
        }
        if (usuario?.perfil == 1 || usuario?.perfil == 2) {
          const colaborador = await prismaClient.usuario.findMany({
            orderBy: {
              uuidCandidato: 'asc'
            },
            where: {
              uuidCandidato: usuario.uuidCandidato
            },
            include: {
              candidato: true,
              Eleitor: {
                where: {
                  created_at: {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                  }
                },
              }
            }
          })
          return res.status(200).json(colaborador)
        }
        if (usuario?.perfil == 3) {
          return res.status(401).json({
            message: 'Acesso não autorizado'
          })
        }
      } else {
        return res.status(400).json({
          message: 'Data Inválida'
        })
      }
    } catch (error) {

      return res.status(400).json({
        error: error,
        message: 'Colaborador não encontrado'
      })
    }
  }
  async cadastroEleitorUsuarioDiaCoordenador(req: Request, res: Response) {
    const { coordenador, data } = req.query;
    const uuid = req.uuid;
    if (!coordenador || !data) {
      return res.status(400).json({ error: 'Parâmetros ausentes' });
    }
    // Converta os parâmetros para os tipos corretos, se necessário
    const coordenadorStr: string = coordenador.toString();
    const dataStr: string = data.toString();
    console.log(coordenadorStr + ' ' + data )
    const usuario = await prismaClient.usuario.findUnique({
      where: {
        uuid: uuid
      },
      include: {
        candidato: {
          include: {
            coligacao: true,
          }
        },
        coligacao: true
      }
    })
    try {
        const now = new Date(dataStr);
        if (usuario?.perfil == 1 || usuario?.perfil == 2 || usuario?.perfil == 5 || usuario?.perfil==4) {
          const colaborador = await prismaClient.usuario.findMany({
            orderBy: {
              uuidCandidato: 'asc'
            },
            where: {
              uuidCandidato: usuario.uuidCandidato,
            },
            include: {
              candidato: true,
              Eleitor: {
                where: {
                  created_at: {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                  }
                },
              }
            }
          })
          return res.status(200).json(colaborador)
        }else{
          return res.status(401).json('Usuario nao autorizado!')
        }

    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error: error,
        message: 'Colaborador não encontrado'
      })
    }
  }
}
