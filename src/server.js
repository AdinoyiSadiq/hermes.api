import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const port = 4000 || process.env;

app.listen(port, () => {
  console.log(`🚀  Server ready at ${port}`);
});
