<template>
  <div>
    <b-container fluid="md" class="my-4 p-2" style="height: 39rem">
      <b-card
        bg-variant="info"
        :header="roomname"
        header-text-variant="info"
        header-tag="header"
        header-bg-variant="light"
        header-class="test-center display-4"
        class="h-100"
      >
        <b-card-body>
          <b-row no-gutters align-h="between" class="h-100">
            <b-col align-self="center" cols="3" class="bg-info h-95 pr-4">
              <h3 class="font-weight-bold text-light mb-3">Active users</h3>
              <b-list-group class="userlist h-90">
                <b-list-group-item
                  class="border-0 font-weight-bold text-left text-primary"
                  v-for="user in users"
                  :key="user.id"
                  >{{ user.username }}</b-list-group-item
                >
              </b-list-group>
            </b-col>
            <b-col align-self="baseline" cols="9" class="bg-light h-75">
              <b-card bg-variant="light" class="text-left chat w-100">
                <b-card-body class="m-2 p-1">
                  <ul class="messages" v-chat-scroll>
                    <li v-for="message in messages" :key="message.id">
                      <span class="text-primary">{{ message.sender }}</span>
                      <span class="text-muted">: {{ message.content }}</span>
                      <span class="text-muted time">{{ message.time }}</span>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
              <b-card bg-variant="light" class="text-left width-fix w-100">
                <b-form inline @submit="onSubmit">
                  <b-form-input
                    v-model="form.message"
                    placeholder="Enter message"
                    required
                    style="width: 86%"
                  >
                  </b-form-input>
                  <b-button
                    type="submit"
                    variant="info"
                    class="mx-2 font-weight-bold"
                    >Send</b-button
                  >
                </b-form>
              </b-card>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-container>
  </div>
</template>

<script>
// import { initReactiveProperties } from "socket.io-client";
import { mapState } from "vuex";
export default {
  data() {
    return {
      form: {
        message: "",
        // timestamp: "",
      },
    };
  },
  // watch:{
  //   roomname(){
  //     if()
  //   }
  // },
  computed: {
    ...mapState({
      roomname: (state) => state.room.title,
      messages: (state) => state.room.msgs,
      users: (state) => state.users,
    }),
  },

  methods: {
    async onSubmit(event) {
      event.preventDefault();
      this.$store.dispatch("sendMsg", this.form.message);
      this.form.message = "";
      // alert(JSON.stringify(this.form));
    },
  },
  mounted() {
    if (!this.roomname) {
      this.$router.replace("/");
    }
  },
  created() {
    // const initReactiveProperties = (user) => {
    //   user.hasNewMessages = false;
    // };
    // this.$socket.on("users", (users) => {
    //   users.forEach((user) => {
    //     user.self = user.userID === this.$socket.id;
    //     initReactiveProperties(user);
    //   });
    //   // put the current user first, and then sort by username
    //   this.users = users.sort((a, b) => {
    //     if (a.self) return -1;
    //     if (b.self) return 1;
    //     if (a.username < b.username) return -1;
    //     return a.username > b.username ? 1 : 0;
    //   });
    //   // console.log("from chat" + JSON.stringify(users));
    // });
  },
};
</script>

<style scoped>
.userlist {
  overflow: auto;
  padding-left: 15px;
}
.chat span {
  font-size: 1.4em;
}
.chat .time {
  display: block;
  font-size: 0.8em;
}
.messages {
  max-height: 300px;
  overflow: auto;
  list-style: none;
}
.messages::-webkit-scrollbar {
  width: 3px;
}
.messages::-webkit-scrollbar-track {
  background: #ddd;
}
.messages::-webkit-scrollbar-thumb {
  background: #aaa;
}
</style>