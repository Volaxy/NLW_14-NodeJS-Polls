import { z } from "zod";
import prisma from "../../libs/prisma";
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

export async function voteOnPoll(app: FastifyInstance) {
    app.post("/polls/:pollId/votes", async (request, response) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        });

        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        });

        const { pollId } = voteOnPollParams.parse(request.params);
        const { pollOptionId } = voteOnPollBody.parse(request.body);


        let { sessionId } = request.cookies;

        if(sessionId) {
            const userPreviusVoteOnPoll = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        pollId,
                        sessionId
                    }
                }
            });

            if(userPreviusVoteOnPoll && userPreviusVoteOnPoll.pollOptionId !== pollOptionId) {
                await prisma.vote.delete({
                    where: {
                        sessionId_pollId: {
                            pollId,
                            sessionId
                        }
                    }
                });
            } else {
                return response.status(400).send({
                    message: "You already vote on this poll"
                });
            }
        }

        if(!sessionId) {
            sessionId = randomUUID();

            // Define um cookie para a aplicação
            response.setCookie("sessionId", sessionId, {
                path: "/", // Define quais rotas terão acesso ao cookie
                maxAge: 60 * 60 * 24 * 30, // Duração do cookie em segundos
                signed: true, // Significa que o back vai garantir que o cookie foi gerenciado pelo próprio back-end
                httpOnly: true, // Somente o back-end pode modificar o cookie, senão qualquer aplicação pode ler as informações dos cookies
            });
        }

        await prisma.vote.create({
            data: {
                sessionId,
                pollId,
                pollOptionId,
            }
        });

        return response.status(201).send();
    });
}