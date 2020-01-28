import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models';
import { auth } from './middleware/authentication';

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (req) {
      return { user: req.user };
    }
    if (connection) {
      return connection.context;
    }
  },
  formatError: (err) => {
    if (!err.originalError) {
      return err;
    }
    const { data, code } = err.originalError;
    const message = err.message || 'an error occurred';
    return { message, data, status: code || 500 };
  },
});

server.applyMiddleware({ app });

const port = process.env.PORT || 4000;

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

models.sequelize.sync().then(() => {
  if (!module.parent) {
    httpServer.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
    });
  }
});

export default app;
