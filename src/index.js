import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import usersRouter from './routes/users'
import { openSSEConnection } from './utils';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

openSSEConnection(process.env.SSE_ENDPOINT);

app.use('/users', usersRouter)

app.listen(process.env.PORT, () =>
	console.log(`Example app listening on port ${process.env.PORT}!`),
);