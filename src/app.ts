import { userRoute } from './user/user.routes';
import express from 'express';
import config from 'config';
import log from './logger';
import connect from './db/connect';
import deserializeUser from './middleware/deserializeUser';
import { postRoute } from './post/post.routes';

const port = config.get('port') as number;
const host = config.get('host') as string;

const app = express();

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(deserializeUser); // For jwt token

app.listen(port, host, () => {
	log.info(`server listening at http://${host}:${port}`);

	connect();

	userRoute(app);
	postRoute(app);
});
