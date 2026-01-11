let express = require('express');
let cors = require('cors');
require('dotenv').config();
let cookie = require('cookie-parser');
let dbConfig = require('./Config/dbConfig');
let jwt = require('jsonwebtoken');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const schema = require('./graphql/schema');
let http = require('http');
const { init: initSocket } = require('./socket_server');

async function startServer() {
  let app = express();
  const httpServer = http.createServer(app);
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
          'http://localhost:3000',
          'https://mili-chat-app.vercel.app',
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );

  app.use(cookie());
  app.use(express.json());
  dbConfig();

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          return {};
        }

        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          return {
            userId: decoded.userId,
            token: token,
            res: res,
          };
        } catch (err) {
          console.log('JWT error:', err.message);
          console.log(err);
          return {};
        }
      },
    })
  );

  app.get('/', (req, res) => {
    res.send('Mili server is running');
  });
  initSocket(httpServer);
  httpServer.listen(process.env.Server_port, () => {
    console.log('Server is running on port', process.env.Server_port);
  });
}

startServer();
