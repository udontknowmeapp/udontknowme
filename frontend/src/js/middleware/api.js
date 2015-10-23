import { rootActionTypes } from '../constants/actionConstants';
import ServerConnection from '../utils/ServerConnection';

export default store => next => action => {
  const { type } = action;

  if (type === rootActionTypes.CONNECTION) {
    action.conn = new ServerConnection(action.dispatch);
    return next(action);
  }

  if (type === rootActionTypes.SEND_MESSAGE) {
    const { player_type, player_name, message, conn } = action;
    conn.send(player_type, player_name, message);
  }

  return next(action);
}
