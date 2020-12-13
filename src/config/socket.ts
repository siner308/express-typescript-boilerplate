/**
 * npm i socket.io @types/socket.io
 */
// import socketio from 'socket.io';
// import { Namespace, Socket } from 'socket.io';
// import http from 'http';
// import express from 'express';
// import { NextFunction } from 'express';
//
// export default function webSocket(
//   server: http.Server,
//   app: express.Express,
//   sessionMiddleware: express.RequestHandler,
// ): void {
//   const io: socketio.Server = socketio(server, {
//     path: '/path/socket.io',
//   });
//   app.set('io', io);
//   const data: Namespace = io.of('/data');
//   io.use((socket: Socket, next: NextFunction) => {
//     sessionMiddleware(socket.request, socket.request.res, next);
//   });
//   data.on('connection', (socket: Socket) => {
//     console.log('Data socket connected');
//     const req: any = socket.request;
//     const {
//       headers: { referer },
//     }: any = req;
//     const overlayId: string = referer.split('/')[referer.split('/').length - 1].replace(/\?._/, '');
//     socket.leave(socket.id);
//     socket.join(overlayId);
//     socket.on('reply', (data: any) => {
//       console.log(data);
//     });
//     socket.on('disconnect', () => {
//       console.log('Data socket disconnected');
//     });
//   });
// }
