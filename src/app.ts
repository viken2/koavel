import config from './config/config';
import app from './server';

const port = config.port || '3000';

app.listen(port, () => {
  console.log(`server is running at http://127.0.0.1:${port}`);
});
