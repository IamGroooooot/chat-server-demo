import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger('Chat');

  afterInit() {
    this.logger.log('Chat Server Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket) {
    client.emit('ping', 'pong');
  }

  @SubscribeMessage('room:join')
  async handleRoomJoin(
    client: Socket,
    payload: { room: string; name: string },
  ) {
    if (!this.validateRoomName(payload)) {
      return;
    }

    await client.join(payload.room);
    client.emit('room:joined', payload);

    this.logger.debug(
      `Client(${payload.name}) ${client.id} joined room ${payload.room}`,
    );
  }

  @SubscribeMessage('room:leave')
  async handleRoomLeave(
    client: Socket,
    payload: { room: string; name: string },
  ) {
    if (!this.validateRoomName(payload)) {
      return;
    }

    await client.leave(payload.room);
    client.emit('room:left', payload);

    this.logger.debug(
      `Client(${payload.name}) ${client.id} left room ${payload.room}`,
    );
  }

  @SubscribeMessage('room:send')
  handleRoomSend(
    client: Socket,
    payload: { room: string; name: string; message: string },
  ) {
    if (!this.validateRoomName(payload)) {
      return;
    }

    const response = {
      room: payload.room,
      message: payload.message,
      sender: {
        sid: client.id,
        name: payload.name,
      },
    };

    client.to(payload.room).emit('room:recv', response);
  }

  private validateRoomName(payload: { room: string }) {
    if (!payload.room) {
      this.logger.error('Room name is empty');
      return false;
    }

    return true;
  }
}
