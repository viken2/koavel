import app from './server';
import config from './config/config';

const port = config.port || 3000;

app.listen(port, () => {
  console.log('Server is running at http://localhost:' + port);
});
