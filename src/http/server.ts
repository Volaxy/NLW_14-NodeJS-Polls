import fastify from "fastify";
import { createPoll } from "./routes/create-poll";

const app = fastify();

// Registra as rotas que serão usadas pelo app
app.register(createPoll);

app.listen({ port: 3333 }).then(() => {
    console.log("Server running!");
});