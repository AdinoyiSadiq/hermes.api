import express from 'express';
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
  context: ({ req }) => ({
    user: req.user,
  }),
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

models.sequelize.sync().then(() => {
  if (!module.parent) {
    app.listen(port, () => {
      console.log(`🚀  Server ready at ${port}`);
    });
  }
});

export default app;
