import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query"] // Mostra um log de cada operação SQL no console da aplicação
});

export default prisma;