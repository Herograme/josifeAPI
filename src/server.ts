import 'dotenv/config';
import app from './app';
import { RedisConfig } from '@/config';
import { ServerConsole } from './core';

const PORT = process.env.SERVER_PORT || 3000;
let server: any;

async function startServer() {
    try {
        // Testar conexão com Redis antes de iniciar o servidor
        const redisClient = RedisConfig.getInstance();
        await redisClient.ping();
        console.log('✅ Conexão com Redis estabelecida');

        // Iniciar servidor
        server = app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);

            const serverConsole = new ServerConsole();

            // Registrar comandos
            serverConsole.registerCommand({
                name: 'shutdown',
                description: 'Shutdown the server',
                execute: async () => {
                    await shutdown('shutdown');
                }
            });



            serverConsole.start();
        });

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
}

async function shutdown(signal: string) {
    console.log(`\n📡 Recebido ${signal}. Iniciando desligamento gracioso...`);

    try {
        // Fechar o servidor (parar de aceitar novas conexões)
        await new Promise<void>((resolve, reject) => {
            if (server) {
                server.close((err: Error | null) => {
                    if (err) reject(err);
                    else resolve();
                });
            } else {
                resolve();
            }
        });

        // Fechar conexão do Redis
        const redisClient = RedisConfig.getInstance();
        await redisClient.quit(); // ou .disconnect() dependendo da sua implementação

        console.log('✅ Servidor e conexões fechados com sucesso');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro durante o desligamento:', error);
        process.exit(1);
    }
}

startServer();