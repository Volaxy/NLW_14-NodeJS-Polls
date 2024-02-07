import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify();

const prisma = new PrismaClient();

app.post("/polls", async (request, response) => {
    // O "zod" define a estrutura que o objeto deve ter quando for enviada uma requisição
    const createPollBody = z.object({
        title: z.string()
    });

    const { title } = createPollBody.parse(request.body);

    const poll = await prisma.poll.create({
        data: {
            title,
        }
    });

    return response.status(201).send(poll);
});

app.listen({ port: 3333 }).then(() => {
    console.log("Server running!");
});