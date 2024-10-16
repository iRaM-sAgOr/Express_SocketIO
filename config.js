const _config = {
  token_secret: process.env.SECRET_TOKEN,
  port: process.env.PORT
};

export const config = Object.freeze(_config);
