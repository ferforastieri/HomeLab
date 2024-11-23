const si = require('systeminformation');
const os = require('os');
const { logger } = require('../services/logService');
const File = require('../models/File');
const User = require('../models/User');

const monitorController = {
    async getSystemStatus(req, res) {
        try {
            // Informações do sistema
            const [cpuLoad, memory, fsSize] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.fsSize()
            ]);

            // Informações do banco de dados
            const [usersCount, filesCount, totalStorage] = await Promise.all([
                User.countDocuments(),
                File.countDocuments(),
                File.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$size" }
                        }
                    }
                ])
            ]);

            const mainDisk = fsSize[0]; // Disco principal

            const systemInfo = {
                cpu: {
                    usage: cpuLoad.currentLoad,
                    cores: os.cpus().length
                },
                memory: {
                    total: memory.total,
                    used: memory.used,
                    free: memory.free
                },
                disk: {
                    total: mainDisk.size,
                    used: mainDisk.used,
                    free: mainDisk.available
                },
                os: {
                    platform: os.platform(),
                    type: os.type(),
                    release: os.release(),
                    uptime: os.uptime()
                },
                application: {
                    users: usersCount,
                    files: filesCount,
                    totalStorage: totalStorage[0]?.total || 0
                }
            };

            res.json(systemInfo);
        } catch (error) {
            logger.error('Erro ao obter status do sistema:', error);
            res.status(500).json({ message: 'Erro ao obter status do sistema' });
        }
    },

    async getLogs(req, res) {
        try {
            const { level = 'info', limit = 100 } = req.query;
            const logs = await new Promise((resolve, reject) => {
                const logFile = level === 'error' ? 'error.log' : 'combined.log';
                require('fs').readFile(
                    require('path').join(__dirname, `../../logs/${logFile}`),
                    'utf8',
                    (err, data) => {
                        if (err) reject(err);
                        const lines = data.split('\n')
                            .filter(Boolean)
                            .map(line => JSON.parse(line))
                            .slice(-limit);
                        resolve(lines);
                    }
                );
            });
            
            res.json(logs);
        } catch (error) {
            logger.error('Erro ao obter logs:', error);
            res.status(500).json({ message: 'Erro ao obter logs' });
        }
    }
};

module.exports = monitorController;