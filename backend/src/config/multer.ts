import multer from "multer";
import { Request } from "express";

// Formatos permitidos (baseados no mimetype informado na requisição).
// Obs: o fileFilter do multer é SÍNCRONO e só tem acesso aos metadados
// do arquivo (mimetype, originalname, size...), NÃO ao buffer.
// Por isso a validação aqui é feita pelo `file.mimetype`.
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Tamanho máximo: 4MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export default {
  // memoryStorage: mantém o arquivo em memória para enviar direto ao Cloudinary.
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  // O fileFilter roda ANTES do arquivo ser aceito pelo multer.
  // Ele recebe apenas metadados, então a validação precisa ser síncrona.
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    // Verifica se o mimetype está na lista de permitidos
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      // Aceita o arquivo
      return cb(null, true);
    }

    // Rejeita o arquivo com uma mensagem amigável
    return cb(
      new Error("Formato de arquivo inválido. Use apenas JPG, JPEG ou PNG."),
    );
  },
};
