import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

interface Contato {
    candidatoUuid: string
    nomeCompleto: string,
    cpf: string,
    sexo: string,
    rg: string,
    nomeMae: string,
    dataNascimento: string,
    celular: string,
    email: string,
    instagram: string,
    facebook: string,
    bairro: string,
    cidade: string,
    coordenador: string,
    endereco: string,
    latitude: string,
    logitude: string,
}

function converterParaData(dataString: string) {
    // Separar a string em partes (dia, mês, ano)
    const partes = dataString.split('/');

    // Desestruturar as partes em variáveis
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Meses são baseados em zero (0-11)
    const ano = parseInt(partes[2], 10);

    // Criar o objeto Date
    return new Date(ano, mes, dia);
}
export class CreateEleitorController {
    async createEleitor(req: Request, res: Response) {
        const { usuario, EnderecoEleitor, nomeMae, sexo, cpf, rg,indicadopor, MidiasSociaisEleitor, contatoEleitor, DadosPessoaisEleitor, nomeCompleto, dataNascimento, sessaoEleitoral, candidatoUuid, sessao, zona, localdevotacao, email, celular, instagram, facebook, twitter, tiktok, endereco, complemento, cidade, codIbge, bairro, pais, uf, latitude, longitude } = req.body
        try {
            const candidato = await prismaClient.candidato.findUnique({
                where: {
                    uuid: candidatoUuid
                }
            })
            var aniversario;
            if (dataNascimento == null) {
                aniversario = null
            } else {
                aniversario = new Date(dataNascimento)
            }
            //const usuario = req.uuid
            const eleitor = await prismaClient.eleitor.create({
                data: {
                    nomeCompleto: nomeCompleto,
                    nomeMae: nomeMae,
                    sexo: sexo,
                    cpf: cpf,
                    rg: rg,
                    dataNascimento: aniversario,
                    candidatoUuid: candidatoUuid,
                    indicado_por: indicadopor,
                    usuarioUuid:usuario,
                    sessaoEleitoral: sessaoEleitoral,
                    coligacaoUuid: candidato?.coligacaoUuid,
                    EnderecoEleitor: {
                        createMany: { data: EnderecoEleitor }

                    },
                    MidiasSociaisEleitor: {
                        createMany: {
                            data: MidiasSociaisEleitor,
                        }

                    },
                    DadosPessoaisEleitor: {
                        createMany: {
                            data: DadosPessoaisEleitor
                        }

                    },
                    contatoEleitor: {
                        createMany: { data: contatoEleitor }

                    },
                }
            })
            return res.status(200).json(eleitor)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: error,
                message: 'erro ao criar Eleitor'
            })
        }
    }
    async createEleitorImportado(req: Request, res: Response) {
        const { data, usuarioUuid, candidatoUuid } = req.body

        try {
            data.forEach(async (element: Contato) => {
                await prismaClient.eleitor.create({
                    data: {
                        nomeCompleto: element.nomeCompleto,
                        dataNascimento: element.dataNascimento == '' ? null : converterParaData(element.dataNascimento),
                        candidatoUuid: candidatoUuid,
                        cpf: element.cpf,
                        sexo: element.sexo,
                        rg: element.rg,
                        usuarioUuid: element.coordenador,
                        EnderecoEleitor: {
                            create: {
                                endereco: element.endereco,
                                bairro: element.bairro,
                                cidade: element.cidade,
                                latitude: -1,
                                longitude: -1
                            },

                        },
                        MidiasSociaisEleitor: {
                            create: {
                                facebook: element.facebook,
                                instagram: element.instagram,
                                tiktok: '',
                                twitter: '',
                            }
                        },
                        contatoEleitor: {
                            create: {
                                email: element.email,
                                celular: element.celular
                            }
                        },
                        sessaoEleitoral: null,

                    }
                })
            });
            res.status(200).json({ message: "Contatos Importados" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error })
        }
        // console.log(i.nomeCompleto)

        // var data = moment(i[dataNascimento], '"DD/MM/YYYY"')



    }

}