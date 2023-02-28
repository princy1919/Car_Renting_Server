require("dotenv").config()

const config = {
  emailid: process.env.PLATFORM_USERNAME,
  password: process.env.PLATFORM_PASSWORD,
  expireTime: process.env.JWTEXPIRE,
  secrets: {
    JWT_SECRET: process.env.PLATFORM_JWTSECRET
  },
  db: {
    url: process.env.PLATFORM_DB_URL
  },
  port: process.env.PLATFORM_PORT,
}

export default config
