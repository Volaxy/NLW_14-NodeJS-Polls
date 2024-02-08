import { z } from "zod";
import prisma from "../../libs/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../libs/redis";

export async function getPoll(app: FastifyInstance) {
    app.get("/polls/:pollId", async (request, response) => {
        const getPollParams = z.object({
            pollId: z.string().uuid(),
        });

        const { pollId } = getPollParams.parse(request.params);

        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },

            include: {
                options: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });

        if(!poll) return response.status(400).send({ message: "Poll not found! :(" });

        const result = await redis.zrange(pollId, 0, -1, "WITHSCORES");

        const votes = result.reduce((obj, line, index) => {
            if(index % 2 === 0) {
                const score = result[index + 1];

                return Object.assign(obj, { [line]: Number(score)})
            } else {
                return obj;
            }
        }, {} as Record<string, number>); // O "Record" define o tipo do objeto

        return response.send({
            poll: {
                id: pollId,
                title: poll.title,

                options: poll.options.map(option => {
                    return {
                        id: option.id,
                        title: option.title,
                        score: option.id in votes ? votes[option.id] : 0
                    }
                })
            }
        });
    });
}