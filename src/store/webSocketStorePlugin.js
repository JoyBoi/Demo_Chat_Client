// import { stringify } from "node:querystring";

export default function createWebSocketPlugin(socket) {
    return (store) => {
        store.$socket = socket;
        socket.onAny((event, ...payload) => {
            console.log(event + " from plugin\n", ...payload);
            const action_name = `socket_${event}`;
            // console.log(action_name in store._actions);
            // if (store._actions.action_name) {
            //     store.dispatch(action_name, payload);
            // }
            // console.log(
            //   Object.prototype.hasOwnProperty.call(store._actions, action_name)
            // );
            if (Object.prototype.hasOwnProperty.call(store._actions, action_name)) {
                store.dispatch(action_name, ...payload);
            }
        });
    };
}