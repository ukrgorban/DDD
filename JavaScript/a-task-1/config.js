const config = {
  db: {
    host: "127.0.0.1",
    port: 5432,
    database: "test",
    user: "test",
    password: "test",
  },
  sandbox: {
    timeout: 5000,
    displayErrors: false,
  },
  staticPort: 8000,
  port: 8001,
  transport: "http",
  framework: "native",
  logger: "pino",
};

module.exports = config;
