const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api', { 
    target: (process.env.NODE_ENV === 'production') ? 'https://api.aquaclub.club' : 'http://localhost:3500',
    changeOrigin: true })
    );
};