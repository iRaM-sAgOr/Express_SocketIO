const _config = {
  token_secret: process.env.SECRET_TOKEN,
  port: process.env.PORT,
  base_url: process.env.BASE_URL
};

export const config = Object.freeze(_config);
