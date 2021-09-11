import {Server, Socket} from 'socket.io'
import logger from './utils/logger'

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER_POSITION: 'UPDATE_USER_POSITION',
    SEND_MESSAGE: 'SEND_MESSAGE',
  },
  SERVER: {
    USERS: 'USERS'
  },
}

const users: any[] = []


function socket({io}: {io: Server}){
  logger.info('sockets enabled')

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected with id ${socket.id}`)


    // Get the list of users when site is loaded
    socket.emit(EVENTS.SERVER.USERS, users)

    /*
    * When a user adds a username, a user gets created
    */
    socket.on(EVENTS.CLIENT.CREATE_USER, ({username, position}) => {
      const user = {
        id: socket.id,
        name: username,
        x: position.x,
        y: position.y,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      }
      users.push(user)

      socket.emit(EVENTS.SERVER.USERS, users)
    })

    /*
    * When a user moves their mouse
    */
    socket.on(EVENTS.CLIENT.UPDATE_USER_POSITION, ({ position}) => {
      users.map(user => {
        if (user.id === socket.id) {
          user.x = position.x
          user.y = position.y
        }
        return user
      })  

      socket.emit(EVENTS.SERVER.USERS, users)
    })

    

  })
}

export default socket