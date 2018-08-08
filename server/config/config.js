var env = process.env.NODE_ENV || 'development';

console.log('*** env ', env);
if (env === 'development' || env === 'test') {
  process.env.PORT = 3000;
  process.env.CREDS = './playground/ddb-key.json';
};
