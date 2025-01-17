// import { Request, Response} from 'express';
// import { prismaClient } from '../../database/prismaClient';

// export class UpdateColaboradorController {

//   async update(req: Request, res: Response) {
//     const {nomeCompleto, cpf, isAtivo, nascimento, sexo, rg, oExpedidor, dataEmissao, eCivel, id_botconversa,
//       cep, pais, estado, cidade, bairro, rua, endereco, acesso, autorizado, funcaoUuid } = req.body
//     const {uuid} = req.params

//     try {
//       const colaboradorAtualizado = await prismaClient.co.update(
//       {
//         where: { uuid },
//         data: { 
//           nomeCompleto,
//           cpf,
//           isAtivo,
//           funcaoUuid,       
//           login: {
//             update: {
//               where: { colaborador_uuid: uuid },
//               data: {
//                 autorizado
//               },
//             },
//           },
//         }
//       }
//       )
//       return res.status(200).json(colaboradorAtualizado)

//     } catch (error) {
//       return res.status(400).json({
//         error: error,
//         message: 'Erro ao atualizar colaborador'
//       })
//     } 
//   }
// }