import fastify from "fastify";

const app = fastify();

app.get("/hello", () => "hello");

app.listen({ port: 3333 }).then(() => {
    console.log("Server running!");
});