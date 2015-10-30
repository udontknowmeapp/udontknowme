import { rootActionTypes } from '../constants/actionConstants';
import { getSocketUri } from '../utils/webSocketUtils';
import ServerConnection from '../utils/ServerConnection';

export default store => next => action => {
  const { type } = action;

  if (type === rootActionTypes.CONNECTION) {
    const uri = getSocketUri();
    action.conn = new ServerConnection(uri, action.dispatch);
    return next(action);
  }

  if (type === rootActionTypes.SEND_MESSAGE) {
    const { player_type, player_name, message, conn } = action;
    conn.send(player_type, player_name, message);
  }

  return next(action);
}
