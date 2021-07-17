import Vue from "vue";
import Vuex from "vuex";
import createWebSocketPlugin from "./webSocketStorePlugin";
import socket from "../utils/socket";
import { gql } from "apollo-boost";
import moment from "moment";
import apolloClient from "../utils/graphql";

Vue.use(Vuex);
const websocketPlugin = createWebSocketPlugin(socket);
export default new Vuex.Store({
    state: {
        room: {},
        rooms: [{
            value: null,
            text: "Select Chat-Room",
        }, ],
        users: [],
    },
    getters: {
        getRoomName: (state) => (roomID) => {
            return state.rooms.find((room) => room.value === roomID);
        },
    },
    mutations: {
        setRoomList(state, list) {
            state.rooms.push(...list);
        },

        setRoomData(state, payload) {
            (state.room = payload),
            state.room.msgs.forEach((msg) => {
                msg.time = moment(Number(msg.time)).format("lll");
            });
        },

        setUsers(state, payload) {
            state.users.push(payload);
        },

        setUserList(state, users) {
            // state.users = payload;
            users.forEach((user) => {
                user.self = user.id === this.$socket.id;
                // initReactiveProperties(user);
            });
            // put the current user first, and then sort by username
            state.users = users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
        },

        pushNewUser(state, user) {
            state.users.push(user);
        },

        pullUser(state, user) {
            state.users = state.users.filter((val) => {
                return val.userID !== user.userID;
            });
        },

        pushLocalMsg(state, msg) {
            state.room.msgs.push(msg);
        },

        pushMsg(state, msg) {
            // console.log(msg);
            // let m = msg.map((o) => ({
            //     sender: o.sender,
            //     content: o.content,
            //     time: moment(Number(o.time)).format("lll"),
            // }));
            state.room.msgs.push({
                sender: msg.sender,
                content: msg.content,
                time: moment(Number(msg.time)).format("lll"),
            });
        },
    },
    actions: {
        async getRoomList({ commit }) {
            let rmLst = await apolloClient.query({
                query: gql `
          query {
            getRoomList {
              id
              title
            }
          }
        `,
            });
            let list = rmLst.data.getRoomList.map((room) => ({
                value: room.id,
                text: room.title,
            }));
            // console.log(rmLst.data.getRoomList.id);
            // console.log(list);
            commit("setRoomList", list);
        },

        async getRoomData({ commit }, payload) {
            let rmData = await apolloClient.query({
                query: gql `
          query($roomID: ID!) {
            getRoomByID(id: $roomID) {
              id
              title
              desc
              msgs {
                sender
                content
                time
              }
            }
          }
        `,
                variables: {
                    roomID: payload.value,
                },
            });
            commit("setRoomData", rmData.data.getRoomByID);
        },

        socket_roomUsers({ commit }, ...payload) {
            // console.log("from Action\t" + payload);
            commit("setUserList", ...payload);
        },

        socket_userConnected({ commit }, payload) {
            payload.self = false;
            commit("pushNewUser", payload);
        },

        socket_userDisconnected({ commit }, payload) {
            commit("pullUser", payload);
        },

        socket_botMsg({ commit }, payload) {
            console.log("From Action" + payload);
            commit("pushMsg", payload);
        },

        async socket_newMsg({ commit }, payload) {
            // console.log(payload.data.addMsgToRoom.id);
            let newmsg = await apolloClient.query({
                query: gql `
          query($roomID: ID!, $msgID: ID!) {
            getMsgListFromRoomByID(id: $roomID, msgid: $msgID) {
              content
              sender
              time
            }
          }
        `,
                variables: {
                    roomID: this.state.room.id,
                    msgID: payload.data.addMsgToRoom.id,
                },
            });
            commit("pushMsg", newmsg.data.getMsgListFromRoomByID);
        },

        async sendMsg({ commit }, payload) {
            let msgBody = {
                sender: this.state.users[0].username,
                content: payload,
                time: moment().format("lll"),
            };
            commit("pushLocalMsg", msgBody);
            let mi = await apolloClient.mutate({
                mutation: gql `
          mutation($roomID: ID!, $sender: String!, $content: String!) {
            addMsgToRoom(
              id: $roomID
              msgbody: { sender: $sender, content: $content }
            ) {
              id
            }
          }
        `,
                variables: {
                    roomID: this.state.room.id,
                    sender: msgBody.sender,
                    content: msgBody.content,
                },
            });
            await socket.emit("chatMsg", {
                msgid: mi,
            });
        },
    },
    modules: {},
    plugins: [websocketPlugin],
});