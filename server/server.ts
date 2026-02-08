import cluster from 'cluster';
import os from 'os';
import 'dotenv/config';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork();
  });
} else {
  import('./app').then(({ default: app }) => {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} listening on port ${PORT}`);
    });
  });
}
