import config from './config/config';
import app from './server';

const port = config.port || '3000';

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
