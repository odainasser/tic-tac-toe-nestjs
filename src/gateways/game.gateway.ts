import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Move } from '../shared/entities/move.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('gameEvent', { message: 'Welcome to the game!' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    client.emit('gameEvent', { message: 'Goodbye!' });
  }

  broadcastMove(move: Move) {
    console.log(`Broadcasting move: ${JSON.stringify(move)}`);
    this.server.emit('move', move);
  }

  broadcastGameStatus(id: string, status: string) {
    console.log(`Broadcasting game status for game ${id}: ${status}`);
    this.server.emit(`game-${id}`, status);
  }
}
