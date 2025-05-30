import { Router } from "express";
import express from "express"
import path from "path";
import { AuthColaboradorController } from './controllers/auth/AuthController';
import { AuthMiddleware } from './middlewares/auth';
import { UpdateLoginController } from './controllers/auth/UpdateLoginController';
import { Logout } from './controllers/auth/Logout';
import { ReadEmpresaController as ReadCandidatosController } from "./controllers/candidato/ReadEmpresaController";
import { CreateEmpresaController } from "./controllers/candidato/CreateEmpresaController";
import { ReadUserController } from "./controllers/usuario/ReadUsuarioController";
// import { UpdateColaboradorController } from "./controllers/coordenador/UpdateCoordenadorController";
import { DeleteColaboradorController } from "./controllers/usuario/DeleteUsuarioController";
import { Readlocalvotacaocontroller } from "./controllers/localdevotacao/ReadLocalVotacaoController";
import { CreateEleitorController } from "./controllers/eleitor/CreateeleitorController";
import { ReadEleitorController } from "./controllers/eleitor/ReadEleitorController";
import { CreateUserController } from "./controllers/usuario/CreateUsuarioController";
import { CreateLocalVotacaoController } from "./controllers/localdevotacao/CreateLocalVotacaoController";
import { CreateEnderecoLocalVotacaoController } from "./controllers/enderecolocalvotacao/CreateLocalVotacaoController";
import { UpdateEleitorController } from "./controllers/eleitor/UpdateEleitorController";
import { HomeScreenController } from "./controllers/dashboard/homescreencontroller";
import { DeleteEleitorController } from "./controllers/eleitor/DeleteEleitor";
import { CreateCandidatoEleicao } from "./controllers/candidatos_eleicao/createcandidatoeleicao";
import { CreateVotosLocaisVotacao } from "./controllers/votos_locais_votacao.dart/CreateVotosLocaisVotacao";
import { ReadVotosLocaisVotacao } from "./controllers/votos_locais_votacao.dart/ReadVotosLocaisVotacal";
import { Readufcontroller } from "./controllers/UF/ReadUfController";
import { CreateAtendimentoController } from "./controllers/atendimento/createatendimentocontroller";
import { ReadAtendimentoController } from "./controllers/atendimento/readatendimenotcontroller";
import { UpdateTarefasController as UpdateAtendimentoController } from "./controllers/atendimento/updateatendimentocontroller";
import { DeleteTarefasController as DeleteAtendimentoController } from "./controllers/atendimento/deleteatendimentocontroller";
import { ReadTipoAtendimento as ReadTipoAtendimentoController } from "./controllers/tipoatendimento/readtipoatendimento";
import { CreateTipoAtendimento } from "./controllers/tipoatendimento/createtipoatendimento";
import { UpdateTipoAtendimentoController } from "./controllers/tipoatendimento/updatetipoatendimento";
import { CreateSessaoVotacaoController } from "./controllers/sessaovotacao/createsessaovotacao";
import { ReadSessaoEleitoralController } from "./controllers/sessaovotacao/readsessaovotacao";
import { DashboardScreenController } from "./controllers/dashboard/dashboardpanelcontroller";
import { consultarSituacaoEleitoral } from "./scraper";
import { UploadDocumentos } from "./controllers/documentosuploads/uploads_documentos";
import { UploadDocumentosUsuario } from "./controllers/docoumentoliredanca/uploads_documentos";

const router = Router()


const createCandidato = new CreateEmpresaController
router.post("/cadastrarcandidato", createCandidato.handle)

const autenticacaoColaborador = new AuthColaboradorController
const logout = new Logout
router.post("/login", autenticacaoColaborador.login)
router.get ("/consulta", async (req, res) => {
    const { titulo } = req.query;
    if (!titulo) {
        return res.status(400).json({ error: "O título de eleitor é obrigatório." });
    }

    const resultado = await consultarSituacaoEleitoral(String(titulo));
    res.status(200).json({ titulo, situacao: resultado });
})
//////////////////////////////////////////////////////////////////////////////////////
router.use(AuthMiddleware)

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
router.get("/get-file-link/:eleitorId/:fileType", UploadDocumentos.getFileLink);
router.use('/uploadsusuario', express.static(path.join(__dirname, '../uploadsusuario')));
router.get("/get-file-linkusuario/:usuarioId/:fileType", UploadDocumentosUsuario.getFileLink);

//login
const atualizaLogin = new UpdateLoginController
router.put("/atualizalogin/:colaborador_uuid", atualizaLogin.update)
router.post("/logout", logout.logout)

//usuario
const createUsuario = new CreateUserController
const readUsuario = new ReadUserController
const deleteUsuario = new DeleteColaboradorController

router.post("/createuser", createUsuario.handle)
router.post("/createlogin", createUsuario.createLogin)
router.get("/getcountusuariodia", readUsuario.cadastroEleitorUsuarioDia)
router.get("/getcountusuariodiacoordenador", readUsuario.cadastroEleitorUsuarioDiaCoordenador)
router.get("/usuarioscandidato/:uuid", readUsuario.colaboradoresCandidato)
router.get("/coordenadorcandidato/:uuid", readUsuario.colaboradoresCandidatoCoordenador)
router.get("/colaborador/:uuid", readUsuario.colaborador)
router.delete("/deletarcolaborador/:uuid", deleteUsuario.delete)

//leitura de estados e municipios
const readuf = new Readufcontroller
router.get("/readufs", readuf.readmany)


//locais de votacao
const readLocalVotacao = new Readlocalvotacaocontroller
const createLocaldeVotacao = new CreateLocalVotacaoController
router.get("/readlocalvotacaouf", readLocalVotacao.seachLocalVotacaoUf)
router.get("/readlocalvotacaoonlyuf", readLocalVotacao.seachLocalVotacaoonlyUf)
router.get("/searchLocalVotacaoonly", readLocalVotacao.searchLocalVotacaoonly)
router.post("/createlocalvotacao", createLocaldeVotacao.createmany)
router.post("/importlocalvotacao", createLocaldeVotacao.import)

//secoes eleitorais
const createSessaoEleitoral = new CreateSessaoVotacaoController
const readSessaoEleitoral = new ReadSessaoEleitoralController
router.post("/importsecaoeleitoral", createSessaoEleitoral.import)
router.get("/getonlyLocalvotacao", readSessaoEleitoral.getonlyLocalVotacao)
//endereco_local_votacao
const createEnderecoLocaldeVotacao = new CreateEnderecoLocalVotacaoController
router.post("/createenderecolocalvotacao", createEnderecoLocaldeVotacao.createmany)
// eleitores
const createEleitor = new CreateEleitorController
const readEleitor = new ReadEleitorController
const updateEleitor = new UpdateEleitorController
const deleteEletor = new DeleteEleitorController
router.post("/createonlyeleitor", createEleitor.createEleitor)
router.post("/createanyeleitor", createEleitor.createEleitorImportado)
router.get("/readeleitorusuario", readEleitor.eleitoresporlideranca)
router.get("/readeleitorescandidato/:uuid", readEleitor.eleitoresCadidato)
router.get("/aniversariantes/:mes", readEleitor.getAniversariantes)
router.put("/updateclassificacaocontato", updateEleitor.upsertclassificacaovoto)
router.put("/updateonlyeleitor", updateEleitor.updateeleitor)
router.delete("/deleteanyeleitor", deleteEletor.deleteVarios)
//dashboard home
const readDashboart = new HomeScreenController
router.get("/readhomedashboard", readDashboart.readHomeScreen)
// dashboard painel
const readDashboartPainel = new DashboardScreenController
router.get("/readdashboardpainel", readDashboartPainel.read)
// atendimento

const createAtendimento = new CreateAtendimentoController
const readAtendimento = new ReadAtendimentoController
const updateAtendimento = new UpdateAtendimentoController
const deleteAtendimento = new DeleteAtendimentoController
router.post("/createatendimento", createAtendimento.handle)
router.get("/readAtendimentosEleitor/:eleitorUuid", readAtendimento.readAtendimentosEleitor)
router.get("/readAtendimentosAll", readAtendimento.readAtendimentosAll)
router.put("/updateAtendimentoEleitor", updateAtendimento.updateTarefa)
router.delete("/deleteAtendimentoEleitor", deleteAtendimento.deleteTarefa)

//tipo atendimento

const createtipoatendimento = new CreateTipoAtendimento
const readTipoAtendimento = new ReadTipoAtendimentoController
const updateTipoAtendimento = new UpdateTipoAtendimentoController
router.post("/tipo-atendimento", createtipoatendimento.create);
router.get("/tipo-atendimento", readTipoAtendimento.findAll);
router.get("/tipo-atendimento/:id", readTipoAtendimento.findOne);
router.put("/tipo-atendimento/:id", updateTipoAtendimento.update);

// Uploads de documentos do eleitor
router.post("/upload/foto-perfil/:eleitorId", UploadDocumentos.uploadFotoPerfil);
router.post("/upload/certidao-nascimento/:eleitorId", UploadDocumentos.uploadCertidaoNascimento);
router.post("/upload/cartao-sus/:eleitorId", UploadDocumentos.uploadCartaoSUS);
router.post("/upload/rg-frente/:eleitorId", UploadDocumentos.uploadRgFrente);
router.post("/upload/rg-costa/:eleitorId", UploadDocumentos.uploadRgCosta);
router.post("/upload/comprovante-residencia/:eleitorId", UploadDocumentos.uploadComprovanteResidencia);

router.post("/uploadsusuario/foto-perfil/:usuarioId", UploadDocumentos.uploadFotoPerfil);
router.post("/uploadsusuario/certidao-nascimento/:usuarioId", UploadDocumentos.uploadCertidaoNascimento);
router.post("/uploadsusuario/cartao-sus/:usuarioId", UploadDocumentos.uploadCartaoSUS);
router.post("/uploadsusuario/rg-frente/:usuarioId", UploadDocumentos.uploadRgFrente);
router.post("/uploadsusuario/rg-costa/:usuarioId", UploadDocumentos.uploadRgCosta);
router.post("/uploadsusuario/comprovante-residencia/:usuarioId", UploadDocumentos.uploadComprovanteResidencia);
export { router }