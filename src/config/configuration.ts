export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});
