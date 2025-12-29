let express = require('express');
let cors = require('cors');
require('dotenv').config();
let dbConfig = require('./Config/dbConfig');
let jwt = require('jsonwebtoken');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const schema = require('./graphql/schema');

async function startServer() {
  let app = express();

  app.use(cors());
  app.use(express.json());
  dbConfig();

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          return {};
        }

        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          return {
            userId: decoded.userId,
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

 

  app.listen(process.env.Server_port, () => {
    console.log('Server is running on port', process.env.Server_port);
  });
}

startServer();
