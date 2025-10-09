import app from '@/app';
import { config } from '@/configs/config';
import logger from '@/libs/logger';
import { createServer } from 'http';
import { SocketService } from '@/services/socket.service';
import { chatService } from '@/services/chat.service';

const startServer = async (): Promise<void> => {
      try {
            // Create HTTP server
            const server = createServer(app);
            
            // Initialize Socket.IO
            const socketService = new SocketService(server, chatService);
            
            // Make Socket.IO instance globally available
            (global as any).io = socketService.getSocketIO();
            
            server.listen(config.PORT, () => {
                  logger.info(`Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`);
                  logger.info(`Socket.IO server initialized`);
            });

            const gracefulShutdown = (signal: string) => {
                  logger.info(`Received ${signal}. Starting graceful shutdown...`);
                  server.close(() => {
                        logger.info('Server closed');
                        process.exit(0);
                  });
            };

            process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
            process.on('SIGINT', () => gracefulShutdown('SIGINT'));
      }
      catch(error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
      }
}

startServer();
