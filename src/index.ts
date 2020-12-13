import http from 'http';
import app from './config/app';
// import webSocket from './socket';

const index: http.Server = app.listen(app.get('port'), () => {
  console.log(
    `\n  App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`,
  );
  console.log('  Press CTRL-C to stop\n');
});

// webSocket(server, app, sessionMiddleware);

export default index;
