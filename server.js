import express from 'express';
import middlewares from './middleware/middleware';
import routes from './routers/index';
require('dotenv').config();

const app = express();

app.use(middlewares.helmet());
app.use(middlewares.morgan('combined'));
app.use(middlewares.cors());

// Enable parsing of JSON payloads
app.use(express.json());

// routers
app.use(routes);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server started on port ${process.env.PORT}...`);
});
