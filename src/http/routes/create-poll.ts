import { z } from "zod";
import prisma from "../../libs/prisma";
import { FastifyInstance } from "fastify";

// Para usar a variável "app", é necessário receber essa variável como parâmetro na função
export async function createPoll(app: FastifyInstance) {
    app.post("/polls", async (request, response) => {
        // O "zod" define a estrutura que o objeto deve ter quando for enviada uma requisição
        const createPollBody = z.object({
            title: z.string(),
            options: z.array(z.string()),
        });

        // Desestrutura o objeto dentro das variáveis para uso posterior
        const { title , options } = createPollBody.parse(request.body);

        // Usa a tabela criada para criar um novo dado no DB
        const poll = await prisma.poll.create({
            data: {
                title,
                // Para se evitar criar 2 "awaits" para criação tanto do "poll" como do "pollOption", a chave estrangeira é referenciada, e dentro dela, colocada a função (neste caso) "createMany"
                // Essa estratégia é usada para se criar uma transação valida que seja atômica, ou seja, ou tudo está correto, ou tudo está errado
                options: {
                    // Cria vários registros de uma vez
                    createMany: {
                        data: options.map(option => {
                            return {
                                title: option,
                                // pollId: poll.id, // No momento da criação, o id não precisa ser informado pois o Prisma sabe qual id tem que ser colocado nessa variável por conta da construção do modelo no "schema.prisma"
                            };
                        })
                    }
                }
            }
        });

        return response.status(201).send(poll);
    });
}