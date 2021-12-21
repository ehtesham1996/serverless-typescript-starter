const env = {
  AWS_REGION: 'local',
  AWS_ACCESS_KEY: 'fake_key',
  AWS_SECRET_KEY: 'fake_secret',
  ENV: 'test'
};

process.env = {
  ...process.env,
  ...env
};
