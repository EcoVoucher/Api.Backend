module.exports = {
    apps: [
      {
        name: "eco-voucher-api",
        script: "server.js",
        interpreter: "node",
        interpreterArgs: "--env-file=.env",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  }
