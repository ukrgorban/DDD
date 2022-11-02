const fastify = require("fastify")();

module.exports = (routing, port) => {
  for (const rout in routing) {
    for (const method in routing[rout]) {
      const path = `/${rout}/${method}/:id`;

      fastify.post(path, async function (request, reply) {
        const handler = routing[rout][method];
        const src = handler.toString();
        const signature = src.substring(0, src.indexOf(")"));
        const args = [];

        if (signature.includes("(id")) {
          args.push(request.params.id);
        }

        if (signature.includes("{")) {
          args.push(request.body);
        }

        const result = await handler(...args);
        reply.header("Access-Control-Allow-Origin", "*");

        return result.rows;
      });
    }
  }

  fastify.listen({ port }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};
