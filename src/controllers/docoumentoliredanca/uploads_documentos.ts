import { PrismaClient, Usuario } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

interface usuario {
    uuid: string;

    nomeCompleto: string;
    nomeMae: string;
    sexo: string;
    cpf: string;
    rg: string | null;
    coligacaoUuid: string | null;
    dataNascimento: Date | null;
    fotoperfil: string | null;
    certidaoNascimento: string | null;
    cartaosus: string | null;
    rgFrente: string | null;
    rgCosta: string | null;
    comprovanteResidencia: string | null;
    // Outras propriedades específicas...
}
export class UploadDocumentosUsuario {
    private static storage = multer.diskStorage({
        destination: async (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
            const { usuarioId } = req.params;
            const dir = path.join(process.cwd(), "uploadsusuario", usuarioId);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        },
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            cb(null, file.originalname); // Mantém o nome original do arquivo
        }
    });

    private static upload = multer({ storage: UploadDocumentosUsuario.storage, limits: { fileSize: 10 * 1024 * 1024 } });

    // Método genérico para upload de documentos
    private static async saveDocument(eleitorId: string, field: string, file: Express.Multer.File) {
        try {
            const updatedEleitor = await prismaClient.eleitor.update({
                where: { uuid: eleitorId },
                data: { [field]: file.originalname }
            });

            return { success: true, eleitor: updatedEleitor, filename: file.originalname };
        } catch (error) {
            return { success: false, error: "Erro ao salvar no banco de dados", details: error };
        }
    }

    // Métodos individuais para cada documento
    static uploadFotoPerfil = [
        UploadDocumentosUsuario.upload.single("file"),
        async (req: Request, res: Response) => {
            const { eleitorId } = req.params;
            if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

            const result = await UploadDocumentosUsuario.saveDocument(eleitorId, "fotoperfil", req.file);
            res.json(result);
        }
    ];

    static uploadCertidaoNascimento = [
        UploadDocumentosUsuario.upload.single("file"),
        async (req: Request, res: Response) => {
            const { eleitorId } = req.params;
            if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

            const result = await UploadDocumentosUsuario.saveDocument(eleitorId, "certidaoNascimento", req.file);
            res.json(result);
        }
    ];

    static uploadCartaoSUS = [
        UploadDocumentosUsuario.upload.single("file"),
        async (req: Request, res: Response) => {
            const { eleitorId } = req.params;
            if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

            const result = await UploadDocumentosUsuario.saveDocument(eleitorId, "cartaosus", req.file);
            res.json(result);
        }
    ];

    static uploadRgFrente = [
        UploadDocumentosUsuario.upload.single("file"),
        async (req: Request, res: Response) => {
            const { eleitorId } = req.params;
            if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

            const result = await UploadDocumentosUsuario.saveDocument(eleitorId, "rgFrente", req.file);
            res.json(result);
        }
    ];

    static uploadRgCosta = [
        UploadDocumentosUsuario.upload.single("file"),
        async (req: Request, res: Response) => {
            const { eleitorId } = req.params;
            if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

            const result = await UploadDocumentosUsuario.saveDocument(eleitorId, "rgCosta", req.file);
            res.json(result);
        }
    ];

    static uploadComprovanteResidencia = [
        UploadDocumentosUsuario.upload.single("file"),
        async (req: Request, res: Response) => {
            const { eleitorId } = req.params;
            if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

            const result = await UploadDocumentosUsuario.saveDocument(eleitorId, "comprovanteResidencia", req.file);
            res.json(result);
        }
    ];
    static getFileLink = async (req: Request, res: Response) => {
        const { eleitorId, fileType } = req.params;

        const allowedFileTypes = [
            "fotoperfil", "certidaoNascimento", "cartaosus",
            "rgFrente", "rgCosta", "comprovanteResidencia"
        ];

        if (!allowedFileTypes.includes(fileType)) {
            return res.status(400).json({ error: "Tipo de arquivo inválido." });
        }

        try {
            // Verifica se o eleitor existe
            const eleitor = await prismaClient.usuario.findUnique({
                where: { uuid: eleitorId }
            });

            if (!eleitor) {
                return res.status(404).json({ error: "Eleitor não encontrado." });
            }

            const filePath = eleitor[fileType as keyof Usuario];
            if (!filePath) {
                return res.status(404).json({ error: `Arquivo ${fileType} não encontrado para este eleitor.` });
            }

            // Retorna o link do arquivo
            const fileLink = `${process.env.SERVER_URL}/uploads/${eleitorId}/${filePath}`;
            return res.status(200).json({ fileLink });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao gerar o link do arquivo.", details: error });
        }
    };

}
