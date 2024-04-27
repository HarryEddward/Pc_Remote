const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 9900,
    allow_origin: '*',
    ip: '192.168.1.135',
    streamKeys: ['key_for_transmition'] // Lista de claves de transmisión permitidas
  }
};

const nms = new NodeMediaServer(config);

nms.on('prePublish', (id, StreamPath, args) => {
  const { key } = args;

  if (!config.http.streamKeys.includes(key)) {
    const session = nms.getSession(id);
    session.reject();
  }
});

nms.run();
