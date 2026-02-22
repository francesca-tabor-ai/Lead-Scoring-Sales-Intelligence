import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './trpc';

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 LSSIS API running at http://localhost:${PORT}/trpc`);
});
