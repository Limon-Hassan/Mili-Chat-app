let express = require('express');
let cors = require('cors');
require('dotenv').config();
let dbConfig = require('./Config/dbConfig');
let { graphqlHTTP } = require('express-graphql');
let app = express();

app.use(cors());
app.use(express.json());
dbConfig();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: require('./graphql/schema'),
    graphiql: true,
  })
);

app.get('/', (req, res) => {
  res.send('Mili server is running');
});

app.listen(process.env.Server_port, () => {
  console.log('Server is running on port', process.env.Server_port);
});
