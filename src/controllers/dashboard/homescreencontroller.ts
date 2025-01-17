import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
export class HomeScreenController {

    async readHomeScreen(req: Request, res: Response) {
        try {
            // Data atual
            const now = new Date();
            now.setHours(now.getHours() - 3);
            // Data de 7 dias atrás
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 12);
            const uuidusuario = req.uuid
            const usuario = await prismaClient.usuario.findUnique({
                where: {
                    uuid: uuidusuario
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
            if ((usuario?.perfil == 4 && usuario.coligacao != null) || (usuario?.perfil == 5 && usuario?.candidato.coligacao != null)) {
                const eleitores = await prismaClient.eleitor.findMany({
                    where: {
                        coligacao: {
                            uuid: usuario?.candidato.coligacao?.uuid,
                        }
                    },
                })
                const eleitorsevenday = await prismaClient.eleitor.findMany({
                    where: {
                        coligacao: {
                            uuid: usuario?.candidato.coligacao?.uuid,
                        },
                        created_at: {
                            gte: sevenDaysAgo
                        }
                    },
                })
                const eleitoreshoje = await prismaClient.eleitor.findMany({
                    where: {
                        coligacao: {
                            uuid: usuario?.candidato.coligacao?.uuid,
                        },
                        created_at: {
                            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                        }
                    },
                })
                const cadastrosCountByDay = await prismaClient.eleitor.groupBy({
                    by: ['created_at'],
                    where: {
                        coligacao: {
                            uuid: usuario?.candidato.coligacao?.uuid,
                        },
                        created_at: {
                            gt: sevenDaysAgo
                        }
                    },
                    _count: {
                        uuid: true, // Contando o número de UUIDs
                    },
                    orderBy: {
                        created_at: 'asc'
                    },


                })
                const countNull = await prismaClient.eleitor.count({
                    where: {
                        coligacao: {
                            uuid: usuario?.candidato.coligacao?.uuid,
                        },
                        classificacaoId: null,
                    },
                });
                const totalELeitoresMap = await prismaClient.eleitor.groupBy({
                    by: ['classificacaoId'],
                    where: {
                        coligacao: {
                            uuid: usuario?.candidato.coligacao?.uuid,
                        }
                    },
                    _count: {
                        classificacaoId: true,
                    }
                })
                console.log(totalELeitoresMap)
                const countByClassificacaoId = totalELeitoresMap.reduce((acc, { classificacaoId, _count }) => {
                    const key = classificacaoId === null ? 'null' : classificacaoId;
                    acc[key] = _count.classificacaoId;
                    return acc;
                }, {} as Record<string | number, number>);
                if (countNull > 0) {
                    countByClassificacaoId['null'] = countNull;
                }
                const countByDay = cadastrosCountByDay.reduce((acc, { created_at, _count }) => {
                    // Extrai apenas a data (ignorando a hora)
                    const date = created_at.toISOString().split('T')[0]; // yyyy-mm-dd
                    acc[date] = (acc[date] || 0) + _count.uuid; // Incrementa a contagem para a data
                    return acc;
                }, {} as Record<string, number>);

                const liderancas = await prismaClient.usuario.findMany({
                    where: {
                        uuidCandidato: usuario.uuidCandidato,
                        perfil: 3
                    }
                })

                return res.status(200).json({
                    eleitores: eleitores.length,
                    liderancas: liderancas.length,
                    eleitorsevenday: eleitorsevenday.length,
                    cadastrosCountByDay: countByDay,
                    totalELeitoresMap: countByClassificacaoId,
                    totalHoje: eleitoreshoje.length,
                })
            }
            if (usuario?.perfil == 1 || usuario?.perfil == 2) {
                const eleitores = await prismaClient.eleitor.findMany({
                    where: {
                        candidatoUuid: usuario?.uuidCandidato,

                    },
                })
                const eleitorHoje = await prismaClient.eleitor.findMany({
                    where: {
                        candidatoUuid: usuario?.uuidCandidato,
                        created_at: {
                            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                        }
                    },
                })
                const eleitorsevenDaysAgo = await prismaClient.eleitor.findMany({
                    where: {
                        candidatoUuid: usuario?.uuidCandidato,
                        created_at: {
                            gte: sevenDaysAgo
                        }
                    },
                })
                const cadastrosCountByDay = await prismaClient.eleitor.groupBy({
                    by: ['created_at'],
                    where: {
                        candidatoUuid: usuario?.uuidCandidato,
                        created_at: {
                            gte: sevenDaysAgo
                        }
                    },
                    _count: {
                        uuid: true,
                    }

                })
                const countNull = await prismaClient.eleitor.count({
                    where: {
                        candidatoUuid: usuario?.uuidCandidato,
                        classificacaoId: null,
                    },
                });

                const totalELeitoresMap = await prismaClient.eleitor.groupBy({
                    by: ['classificacaoId'],
                    where: {
                        candidatoUuid: usuario?.uuidCandidato,
                    },
                    _count: {
                        classificacaoId: true,
                    }
                })
                console.log(totalELeitoresMap)
                const countByClassificacaoId = totalELeitoresMap.reduce((acc, { classificacaoId, _count }) => {
                    const key = classificacaoId === null ? 'null' : classificacaoId;
                    acc[key] = _count.classificacaoId;
                    return acc;
                }, {} as Record<string | number, number>);
                if (countNull > 0) {
                    countByClassificacaoId['null'] = countNull;
                }
                const countByDay = cadastrosCountByDay.reduce((acc, { created_at, _count }) => {
                    // Extrai apenas a data (ignorando a hora)
                    const date = created_at.toISOString().split('T')[0]; // yyyy-mm-dd
                    acc[date] = (acc[date] || 0) + _count.uuid; // Incrementa a contagem para a data
                    return acc;
                }, {} as Record<string, number>);

                const liderancas = await prismaClient.usuario.findMany({
                    where: {
                        uuidCandidato: usuario.uuidCandidato,
                        perfil: 3
                    }
                })
                return res.status(200).json({
                    eleitores: eleitores.length,
                    liderancas: liderancas.length,
                    eleitorsevenday: eleitorsevenDaysAgo.length,
                    cadastrosCountByDay: countByDay,
                    totalHoje: eleitorHoje.length,
                    totalELeitoresMap: countByClassificacaoId
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

}