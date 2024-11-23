module.exports = {
    apps: [{
        name: 'servidor-pessoal',
        script: 'src/server.js',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        },
        error_file: 'logs/pm2/err.log',
        out_file: 'logs/pm2/out.log',
        log_file: 'logs/pm2/combined.log',
        time: true
    }]
};