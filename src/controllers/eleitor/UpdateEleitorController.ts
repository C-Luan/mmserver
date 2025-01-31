import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
interface EnderecoEleitor {
    uuid: string;
    endereco: string;
    complemento?: string;
    cidade: string;
    codIbge: string;
    bairro: string;
    pais: string;
    uf: string;
    latitude?: number;
    longitude?: number;
  }
  interface MidiasSociaisEleitor {
    uuid: string;        
    instagram?: string;   
    facebook?: string;  
    twitter?: string;  
    tiktok?: string;     
  }
  interface   DadosPessoaisEleitor {
    uuid: string;             // Identificador único
    sessao: string;           // Sessão de votação
    zona: string;             // Zona eleitoral
    localdevotacao: string;   // Local de votação
  }
  interface contatoEleitor {
    uuid: string;      // Identificador único
    email: string;     // Email do eleitor
    celular: string;   // Número de celular do eleitor
  }
export class UpdateEleitorController {
    async upsertclassificacaovoto(req: Request, res: Response) {
        const { uuid, classificacaoId } = req.body
        try {
            const classificacao = await prismaClient.eleitor.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    classificacaoId: classificacaoId,
                }
            })
            res.status(200).json({
                message: "Classificação Atualizada"
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error,
                message: "Internal Server Error"
            })
        }
    }
    async updateeleitor(req: Request, res: Response) {
        const { uuid,usuario,sexo, EnderecoEleitor: EnderecoEleitor,MidiasSociaisEleitor: MidiasSociaisEleitor, contatoEleitor:contatoEleitor, DadosPessoaisEleitor:DadosPessoaisEleitor, nomeCompleto, nomeMae, dataNascimento, sessaoEleitoral, candidatoUuid, sessao, zona, localdevotacao, email, celular, instagram,facebook, twitter, tiktok, endereco, complemento, cidade, codIbge, bairro, pais, uf, latitude, longitude } = req.body
 
        try {
          
            var aniversario ;
            if(dataNascimento == null){
            aniversario = null
            }else{
        aniversario = new Date(dataNascimento)
            }
            const candidato = await prismaClient.candidato.findUnique({
                where: {
                    uuid: candidatoUuid
                }
            })
            const classificacao = await prismaClient.eleitor.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    nomeCompleto: nomeCompleto,
                    nomeMae:nomeMae,
                    sexo: sexo,
                    dataNascimento: aniversario,
                    candidatoUuid: candidatoUuid,
                    usuarioUuid: usuario,
                    sessaoEleitoral: sessaoEleitoral,
                    coligacaoUuid: candidato?.coligacaoUuid,
                    MidiasSociaisEleitor:{
                        update:{
                            where:{
                                uuid:MidiasSociaisEleitor.uuid,
                            },data:{
                                instagram:MidiasSociaisEleitor.instagram,
                                facebook:MidiasSociaisEleitor.facebook,
                                twitter:MidiasSociaisEleitor.twitter,
                                tiktok:MidiasSociaisEleitor.tiktok,
                            }
                        }
                    },
                    contatoEleitor:{
                        update:{
                            where:{
                                uuid: contatoEleitor.uuid,

                            },
                            data:{
                                email:contatoEleitor.email,
                                celular:contatoEleitor.celular,
                            }
                        }
                    },
                    DadosPessoaisEleitor:{
                        update:{
                            where:{
                                uuid: DadosPessoaisEleitor.uuid,
                            },
                            data:{
                                sessao:DadosPessoaisEleitor.sessao,
                                zona:DadosPessoaisEleitor.zona,
                           
                            }
                        }
                    },
                    EnderecoEleitor:{
                        update:{
                            where:{
                                uuid:EnderecoEleitor.uuid,
                            },
                            data:{
                                endereco:EnderecoEleitor.endereco,
                                cidade:EnderecoEleitor.cidade,
                                complemento:EnderecoEleitor.complemento,
                                bairro:EnderecoEleitor.bairro,
                                nCasa:EnderecoEleitor.nCasa,
                                cep:EnderecoEleitor.cep,
                                uf:EnderecoEleitor.uf,
                            }
                        }
                    }
                }
            })
            res.status(200).json({
                message: "Classificação Atualizada"
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error,
                message: "Internal Server Error"
            })
        }
    }
}
interface EnderecoEleitor {

}