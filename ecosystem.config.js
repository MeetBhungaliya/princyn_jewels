module.exports = {
  apps: [
    {
      name: "princyn_jewels",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
