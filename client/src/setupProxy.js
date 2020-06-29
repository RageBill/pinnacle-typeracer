const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        "/socket.io",
        createProxyMiddleware({
            target: process.env.REACT_APP_SOCKET_IO_URI,
            changeOrigin: true,
            ws: true,
        })
    );
    app.use(
        "/docker-ray",
        createProxyMiddleware({
            target: process.env.REACT_APP_SOCKET_IO_URI,
            changeOrigin: true,
        })
    );
};
