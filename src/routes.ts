import { Router } from "express";
import { AuthColaboradorController } from './controllers/auth/AuthController';
import { AuthMiddleware } from './middlewares/auth';
import { UpdateLoginController } from './controllers/auth/UpdateLoginController';
import { Logout } from './controllers/auth/Logout';
import { ReadEmpresaController } from "./controllers/candidato/ReadEmpresaController";
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

const router = Router()


const createEmpresa = new CreateEmpresaController

const autenticacaoColaborador = new AuthColaboradorController
const readEmpresa = new ReadEmpresaController

const logout = new Logout
router.post("/login", autenticacaoColaborador.login)
router.post("/cadastrarcandidato", createEmpresa.handle)
const createcandidatoeleicao = new CreateCandidatoEleicao
router.post("/importanycandidatos", createcandidatoeleicao.createEleitorImportado)
const createvotacaolocal = new CreateVotosLocaisVotacao
router.post("/importvotoslocalvotacao", createvotacaolocal.createimportvotoslocalvotacao)
const readlocaisvotacao = new ReadVotosLocaisVotacao
router.get("/readvotoscandidato", readlocaisvotacao.readvotos)
//////////////////////////////////////////////////////////////////////////////////////
router.use(AuthMiddleware)

const createColaborador = new CreateUserController
const readColaborador = new ReadUserController
// const updateColaborador = new UpdateColaboradorController
const deleteColaborador = new DeleteColaboradorController
const atualizalogin = new UpdateLoginController
router.post("/createuser", createColaborador.handle)
router.get("/getEmpresa", readEmpresa.getCandidatos)
router.get("/getcountusuariodia", readColaborador.cadastroEleitorUsuarioDia)
router.get("/getcountusuariodiacoordenador", readColaborador.cadastroEleitorUsuarioDiaCoordenador)
router.get("/usuarioscandidato/:uuid", readColaborador.colaboradoresCandidato)
router.get("/coordenadorcandidato/:uuid", readColaborador.colaboradoresCandidatoCoordenador)
router.get("/colaborador/:uuid", readColaborador.colaborador)

// router.put("/atualizarcolaborador/:uuid", updateColaborador.update)
router.put("/atualizalogin/:colaborador_uuid", atualizalogin.update)
router.delete("/deletarcolaborador/:uuid", deleteColaborador.delete)
router.post("/logout", logout.logout)
//leitura de estados e municipios
const readuf = new Readufcontroller
router.get("/readufs", readuf.readmany)
//candidatos
const readCandidatos = new ReadEmpresaController
router.get("/readcandidadoscoligacao", readCandidatos.getCandidatosColigacaoAno)
//locais de votacao
const readLocalVotacao = new Readlocalvotacaocontroller
const createLocaldeVotacao = new CreateLocalVotacaoController
router.get("/readlocalvotacaouf", readLocalVotacao.seachLocalVotacaoUf)
router.get("/readlocalvotacaoonlyuf", readLocalVotacao.seachLocalVotacaoonlyUf)
router.get("/searchLocalVotacaoonly", readLocalVotacao.searchLocalVotacaoonly)
router.post("/createlocalvotacao", createLocaldeVotacao.createmany)



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
router.put("/updateclassificacaocontato", updateEleitor.upsertclassificacaovoto)
router.put("/updateonlyeleitor", updateEleitor.updateeleitor)
router.delete("/deleteanyeleitor", deleteEletor.deleteVarios)
//dashboard
const readDashboart = new HomeScreenController
router.get("/readhomedashboard", readDashboart.readHomeScreen)
export { router }