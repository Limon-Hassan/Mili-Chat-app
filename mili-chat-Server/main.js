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
const setAuthCookies = require('./Helper/setAuthCookies');

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
    }),
  );

  app.use(express.json());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  dbConfig();

  const server = new ApolloServer({
    schema,
  });
  await server.start();
  app.use(cookie());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let userId = null;
        let accessToken = req.cookies?.accessToken || null;
        let refreshToken = req.cookies?.refreshToken || null;

        if (accessToken) {
          try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            userId = decoded.userId;
            accessToken = accessToken;
          } catch (err) {
            console.log('Access token expired');
          }
        }

        if (refreshToken) {
          try {
            const decoded = jwt.verify(
              refreshToken,
              process.env.REFRESH_SECRET,
            );

            userId = decoded.userId;

            const newAccessToken = jwt.sign(
              { userId },
              process.env.JWT_SECRET,
              { expiresIn: '15m' },
            );
            setAuthCookies(res, newAccessToken, refreshToken);
            // res.cookie('accessToken', newAccessToken, {
            //   httpOnly: true,
            //   sameSite: 'lax',
            //   secure: false,
            //   maxAge: 15 * 60 * 1000,
            //   path: '/',
            // });

            accessToken = newAccessToken;
            refreshToken = refreshToken;
          } catch (err) {
            console.log('Refresh token invalid');
          }
        }

        let context = {
          req,
          res,
          userId,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        };

        return context;
      },
    }),
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

// console.log('Context user:', user);
// console.log('Context refreshValid:', refreshValid);
// console.log('Context refreshToken:', req.cookies?.refreshToken);

// app.use('/graphql', authMiddleware);

// app.use(
//   '/graphql',
//   expressMiddleware(server, {
//     context: async ({ req, res }) => {
//       console.log('req cokkies here => ', req.cookies.refreshToken);
//       return {
//         req,
//         res,
//         user: req.user || null,
//         refreshValid: req.refreshValid || false,
//         accessToken: req.cookies?.accessToken || null,
//         refreshToken: req.cookies?.refreshToken || null,
//       };
//     },
//   })
// );
