

export default () => ({
  node: {
    env: process.env.NODE_ENV || 'development'
  },
  kafka: {
    broker: process.env.KAFKA_BROKERS || 'localhost:9092',
    clientId: process.env.KAFKA_CLIENT_ID || 'ms_categories',
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'categories-consumer-group'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'testdb',
    password: process.env.DB_PASSWORD || 'testdb',
    database: process.env.DB_DATABASE || 'testdb'
  }
})