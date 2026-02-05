const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrsoupdejourtommyba24e = onRequest({"region":"us-west1"}, (req, res) => server.then(it => it.handle(req, res)));
  