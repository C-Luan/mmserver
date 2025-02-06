import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class ReadEleitorController {
    async eleitoresporlideranca(req: Request, res: Response) {
        try {
            const { usuarioUuid } = req.body
            const eleitores = await prismaClient.eleitor.findMany({
                orderBy: {
                    nomeCompleto: 'asc'
                },
                where: {
                    usuarioUuid
                },
                include: {
                    criado_por: {
                        include: {
                            candidato: true
                        }
                    },
                    candidato: {
                        include: {
                            coligacao: true,
                        }
                    },
                    classificacao: true,
                    EnderecoEleitor: true,

                    DadosPessoaisEleitor: true,
                    contatoEleitor: true,
                    MidiasSociaisEleitor: true,
Indicacoes:true,
Formiguinha:true,
                    sessaoeleitoral: {

                        include: {

                            sessoesEleitorais: true,
                            endereco: true,

                        }
                    }
                }
            })
            res.status(200).json({ eleitores })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: error,
                message: 'Falha Interna do Servidor'
            })
        }
    }

    async eleitoresCadidato(req: Request, res: Response) {
        try {
            const { uuid } = req.params
            const usuariouuid = req.uuid
            const usuario = await prismaClient.usuario.findUnique({
                where: {
                    uuid: usuariouuid
                }, include: {
                    coligacao: true,
                    candidato: true,
                },
            })
            if (usuario == null) {
                return res.status(401).json({ Message: "Usuario nao encontrado" })
            }
            if (usuario.perfil == 5) {

                const eleitores = await prismaClient.eleitor.findMany({
                    orderBy: {
                        nomeCompleto: 'asc'
                    },
                    include: {
                        criado_por: {
                            include: {
                                candidato: true
                            }
                        },
                        candidato: true,
                        classificacao: true,
                        EnderecoEleitor: true,Indicacoes:true,
                        Formiguinha:true,
                        DadosPessoaisEleitor: true,
                        contatoEleitor: true,
                        MidiasSociaisEleitor: true,
                        sessaoeleitoral: {
                            include: {
                                sessoesEleitorais: true,
                                endereco: true,

                            }
                        }
                    }
                })
                return res.status(200).json({ eleitores })
            }
            if (usuario.perfil == 4 && usuario.coligacao != null) {

                const eleitores = await prismaClient.eleitor.findMany({
                    orderBy: {
                        nomeCompleto: 'asc'
                    },
                    where: {
                        coligacao: {
                            usuarioUuid: usuario.uuid,
                        }
                    }, include: {
                        criado_por: {
                            include: {
                                candidato: true
                            }
                        },
                        candidato: true,
                        classificacao: true,
                        EnderecoEleitor: true,
                        DadosPessoaisEleitor: true,
                        contatoEleitor: true,Indicacoes:true,
                        Formiguinha:true,
                        MidiasSociaisEleitor: true,
                        sessaoeleitoral: {
                            include: {
                                sessoesEleitorais: true,
                                endereco: true,

                            }
                        }
                    }
                })
                return res.status(200).json({ eleitores })
            }
            if (usuario.perfil == 2) {
                var eleitores = await prismaClient.eleitor.findMany({
                    orderBy: {
                        nomeCompleto: 'asc'
                    },
                    where: {
                        candidatoUuid: uuid,


                    },
                    include: {
                        criado_por: {
                            include: {
                                candidato: true
                            }
                        },
                        candidato: true,
                        coligacao: true,
                        classificacao: true,
                        EnderecoEleitor: true,
                        DadosPessoaisEleitor: true,Indicacoes:true,
                        Formiguinha:true,
                        contatoEleitor: true,
                        MidiasSociaisEleitor: true,
                        sessaoeleitoral: {
                            include: {
                                sessoesEleitorais: true,
                                endereco: true,

                            }
                        }
                    }
                })

                // var eleitores = eleitores.filter(e => e.usuarioUuid === usuario.uuid || e.criado_por?.coordenador === usuario.uuid
                // )

                return res.status(200).json({ eleitores })
            }
            if (usuario.perfil == 1) {
                const eleitores = await prismaClient.eleitor.findMany({
                    orderBy: {
                        nomeCompleto: 'asc'
                    },
                    where: {
                        candidatoUuid: uuid,
                    },
                    include: {
                        criado_por: {
                            include: {
                                candidato: true
                            }
                        },
                        candidato: true,
                        classificacao: true,
                        EnderecoEleitor: true,
                        DadosPessoaisEleitor: true,
                        contatoEleitor: true,Indicacoes:true,
                        Formiguinha:true,
                        MidiasSociaisEleitor: true,
                        sessaoeleitoral: {
                            include: {
                                sessoesEleitorais: true,
                                endereco: true,

                            }
                        }
                    }
                })
                return res.status(200).json({ eleitores })
            }
            return res.status(404).json({
                message: 'Falha ao encontrar dados'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                "error": error,
                "message": 'Falha Interna do Servidor'
            })
        }
    }
    async eleitoresCadidatoResumo(req: Request, res: Response) {
        try {
            const { uuid } = req.params
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
            if (usuario.perfil == 4 && usuario.coligacao != null) {
                const eleitores = await prismaClient.eleitor.findMany({
                    orderBy: {
                        nomeCompleto: 'asc'
                    },
                    where: {
                        coligacao: {
                            usuarioUuid: usuario.uuid,
                        }
                    }, include: {
                        criado_por: {
                            include: {
                                candidato: true
                            }
                        },
                        candidato: true,
                        classificacao: true,
                        EnderecoEleitor: true,Indicacoes:true,
                        Formiguinha:true,
                        DadosPessoaisEleitor: true,
                        contatoEleitor: true,
                        MidiasSociaisEleitor: true,
                        sessaoeleitoral: {
                            include: {
                                sessoesEleitorais: true,
                                endereco: true,

                            }
                        }
                    }
                })
                return res.status(200).json({ eleitores })
            }
            if (usuario.perfil == 2) {
                var eleitores = await prismaClient.eleitor.findMany({
                    orderBy: {
                        nomeCompleto: 'asc'
                    },
                    where: {
                        candidatoUuid: uuid,

                    },
                    include: {
                        criado_por: {
                            include: {
                                candidato: true
                            }
                        },
                        candidato: true,
                        coligacao: true,
                        classificacao: true,
                        EnderecoEleitor: true,Indicacoes:true,
                        Formiguinha:true,
                        DadosPessoaisEleitor: true,
                        contatoEleitor: true,
                        MidiasSociaisEleitor: true,
                        sessaoeleitoral: {
                            include: {
                                sessoesEleitorais: true,
                                endereco: true,

                            }
                        }
                    }
                })

                // eleitores = eleitores.filter(e => {
                //     console.log({coordenador: e.criado_por?.coordenador,usuario:usuario.uuid})
                //     e.criado_por?.coordenador===usuario.uuid})
                //     console.log(eleitores)
                return res.status(200).json({ eleitores })
            }
            if (usuario.perfil == 1) {
                const eleitores = await prismaClient.eleitor.findMany({
                    orderBy: {
                        nomeCompleto: 'asc'
                    },
                    where: {
                        candidatoUuid: uuid,
                    },
                    include: {
                        criado_por: {
                            include: {
                                candidato: true
                            }
                        },
                        candidato: true,
                        classificacao: true,Indicacoes:true,
                        Formiguinha:true,
                        EnderecoEleitor: true,
                        DadosPessoaisEleitor: true,
                        contatoEleitor: true,
                        MidiasSociaisEleitor: true,
                        sessaoeleitoral: {
                            include: {
                                sessoesEleitorais: true,
                                endereco: true,

                            }
                        }
                    }
                })
                return res.status(200).json({ eleitores })
            }
            return res.status(404).json({
                message: 'Falha ao encontrar dados'
            })
        } catch (error) {

            return res.status(500).json({
                "error": error,
                "message": 'Falha Interna do Servidor'
            })
        }
    }
    async resumoeleitorescandidatos(req: Request, res: Response) {
        const { uuid } = req.params
        var sessoes = 0;
        try {
            const { uuid } = req.params
            const eleitores = await prismaClient.eleitor.findMany({
                orderBy: {
                    nomeCompleto: 'asc'
                },
                where: {
                    candidatoUuid: uuid,
                },

                include: {
                    classificacao: {
                        select: {
                            _count: true,
                        }
                    },

                    sessaoeleitoral: true
                }
            })
            res.status(200).json({
                contatos: eleitores.length

            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: error,
                message: 'Falha Interna do Servidor'
            })
        }
    }
    async getAniversariantes(req: Request, res: Response) {
        const mes = parseInt(req.params.mes, 10); // Obtemos o mês a partir dos parâmetros da URL

        if (isNaN(mes) || mes < 1 || mes > 12) {
            return res.status(400).json({ error: "O parâmetro 'mes' deve ser um número entre 1 e 12." });
        }

        try {
            const aniversariantes = await prismaClient.eleitor.findMany({
                where: {
                    dataNascimento: {
                        not: null,
                    },
                },
              include:{
                    criado_por: {
                        include: {
                            candidato: true
                        }
                    },
                    candidato: true,
                    classificacao: true,
                    EnderecoEleitor: true,
                    DadosPessoaisEleitor: true,
                    contatoEleitor: true,
                    MidiasSociaisEleitor: true,
                    sessaoeleitoral: {
                        include: {
                            sessoesEleitorais: true,
                            endereco: true,

                        }
                    }
                }
            });

            // Filtra aniversariantes com base no mês fornecido
            const aniversariantesDoMes = aniversariantes.filter((eleitor) => {
                if (!eleitor.dataNascimento) return false;
                return eleitor.dataNascimento.getMonth() + 1 === mes;
            });

            res.status(200).json(aniversariantesDoMes);
        } catch (error) {
            console.error("Erro ao buscar aniversariantes do mês:", error);
            res.status(500).json({ error: "Erro ao buscar aniversariantes do mês" });
        }
    }
}