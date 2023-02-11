export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3333,
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost:6379',
    PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});
