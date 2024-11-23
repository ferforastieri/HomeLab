const si = require('systeminformation');
const os = require('os');
const osUtils = require('node-os-utils');

const getSystemInfo = async (req, res) => {
    try {
        const [cpu, mem, disk, temp] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.cpuTemperature()
        ]);

        const systemInfo = {
            cpu: {
                usage: Math.round(cpu.currentLoad),
                temperature: Math.round(temp.main || 0),
                cores: os.cpus().length
            },
            memory: {
                total: Math.round(mem.total / 1024 / 1024 / 1024), // GB
                used: Math.round(mem.used / 1024 / 1024 / 1024),   // GB
                free: Math.round(mem.free / 1024 / 1024 / 1024)    // GB
            },
            disk: disk.map(drive => ({
                drive: drive.fs,
                size: Math.round(drive.size / 1024 / 1024 / 1024),
                used: Math.round(drive.used / 1024 / 1024 / 1024),
                available: Math.round(drive.available / 1024 / 1024 / 1024)
            })),
            uptime: os.uptime(),
            hostname: os.hostname()
        };

        res.json(systemInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSystemInfo };