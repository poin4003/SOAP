const app = require('./src/app');

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server link: http://localhost:\x1b[36m${PORT}\x1b[0m`);
});