
const debug = require('debug')('app:bin:server')
const port = config.server_port

import config from '../config'
import server from '../server/main'

server.listen(port)
debug(`Server is now running at http://localhost:${port}.`)
