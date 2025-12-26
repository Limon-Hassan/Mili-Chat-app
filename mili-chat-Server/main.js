let express = require('express');
let cors = require('cors');
require('dotenv').config();
let dbConfig = require('./Config/dbConfig');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const schema = require('./graphql/schema');

async function startServer() {
  let app = express();

  app.use(cors());
  app.use(express.json());
  dbConfig();

  let server = new ApolloServer({
    schema,
  });

  await server.start();
  app.use('/graphql', expressMiddleware(server));
  app.get('/', (req, res) => {
    res.send('Mili server is running');
  });

  app.listen(process.env.Server_port, () => {
    console.log('Server is running on port', process.env.Server_port);
  });
}

startServer();
