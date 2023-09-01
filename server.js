/**
 * Sockets de comuncacion front y back
 *
 * Descripcion Larga
 *
 * @category     Gestion Documental
 * @package      Orfeo NG 
 * @subpackage   Sockets
 * @author       Skina Technologies SAS (http://www.skinatech.com)
 * @license      Mixta <https://orfeolibre.org/inicio/licencia-de-orfeo-ng/>
 * @license      LICENSE.md
 * @link         http://www.orfeolibre.org
 * @since        Archivo disponible desde la version 1.0.0
 *
 * @copyright    2023 Skina Technologies SAS
 */

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

/**
 * Variables para el sistema de conexión con el front
 */
const socketConnect = 'socketConnect';
const socketMenu = 'socketMenu';
const socketMenuMulti = 'socketMenuMulti';
const socketLanguage = 'socketLanguage';

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

var connections = {};

io.on('connection', (socket) => {
    console.log('User connect ' + ` ${socket.id }`);

    socket.on(socketConnect, (data) => {
        /**
         * Alimentando array para envíos privados
         */
        connections[data.idUser] = socket.id;
    });

    /**
     * Escuchando los cambios del menú
     */
    socket.on(socketMenu, (data) => {

        /**
         * Enviando del menú al usuario
         */
        io.to(connections[data.to]).emit(socketMenu, { dataUser: data.dataUser, dataMenu: data.dataMenu });
    });

    /**
     * Eschuchando los cambios del menú para todos los usuarios de un perfil
     */
    socket.on(socketMenuMulti, (data) => {

        console.log(data.room);

        /**
         * Enviando los cambios del menú para todos los usuarios de un perfil
         */
        io.emit('roomRolUser_' + data.room, data.dataMenu);

        //io.emit('pruebasMas', data.dataMenu);
    });

    /**
     * Eschuchando los cambios del lenguaje para todos los usuarios
     */
    socket.on(socketLanguage, (data) => {

        console.log(data.room);
        console.log(data.language);
        /**
         * Enviando los cambios del menú para cada los usuario
         */
        io.emit('roomLanguageUser_' + data.room, data.language);

        //io.emit('pruebasMas', data.dataMenu);
    });

    socket.on('disconnect', (data) => {
        console.log('user disconnected');
    });
});

http.listen(3005, () => {
    console.log('listening on *:3005');
});
