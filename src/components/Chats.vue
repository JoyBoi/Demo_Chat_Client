<template>
  <div>
    <b-container class="my-4 p-2" style="height: auto">
      <b-card
        bg-variant="info"
        :header="roomname"
        header-text-variant="info"
        header-tag="header"
        header-bg-variant="light"
        header-class="test-center display-4"
        class="h-100 p-0 m-0"
      >
        <!-- <b-card-body> -->
        <b-row>
          <b-col
            cols="12"
            lg="3"
            md="12"
            class="d-block d-sm-none d-md-none bg-info h-95"
          >
            <b-button v-b-toggle.collapse-1 variant="primary" class="pb-2 mb-2"
              >Active Users</b-button
            >
            <b-collapse id="collapse-1" class="mt-2">
              <b-list-group class="userlist h-90">
                <b-list-group-item
                  class="border-0 font-weight-bold text-left text-primary mb-2"
                  v-for="user in users"
                  :key="user.id"
                  >{{ user.username }}</b-list-group-item
                >
              </b-list-group>
            </b-collapse>
          </b-col>
          <b-col
            cols="12"
            lg="3"
            md="12"
            class="d-none d-sm-block bg-info h-95 pr-4"
          >
            <h3 class="font-weight-bold text-light mb-3 text-center">
              Active users
            </h3>
            <b-list-group class="userlist h-90">
              <b-list-group-item
                class="border-0 font-weight-bold text-left text-primary mb-2"
                v-for="user in users"
                :key="user.id"
                >{{ user.username }} ✅</b-list-group-item
              >
            </b-list-group>
          </b-col>
          <b-col cols="12" lg="9" md="12" sm="12" class="bg-light h-75">
            <ul class="messages chat" v-chat-scroll>
              <li v-for="message in messages" :key="message.id">
                <span class="text-primary">{{ message.sender }}</span>
                <span class="text-muted">: {{ message.content }}</span>
                <span class="text-muted time">{{ message.time }}</span>
              </li>
            </ul>

            <b-card bg-variant="light" class="w-100 m-2">
              <b-form @submit="onSubmit">
                <b-row>
                  <b-col cols="12" sm="8" md="10" lg="10">
                    <b-form-input
                      v-model="form.message"
                      placeholder="Enter message"
                      required
                      style="width: 100%"
                      class="mt-2"
                    >
                    </b-form-input>
                  </b-col>
                  <b-col>
                    <b-button
                      type="submit"
                      variant="info"
                      class="mt-2 font-weight-bold"
                      >Send</b-button
                    >
                  </b-col>
                </b-row>
              </b-form>
            </b-card>
          </b-col>
        </b-row>
        <!-- </b-card-body> -->
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
  font-size: 1.2em;
}
.chat .time {
  display: block;
  font-size: 0.7em;
}
.messages {
  max-height: 300px;
  overflow-y: scroll;
  list-style: none;
}
.messages::-webkit-scrollbar {
  width: 2px;
}
.messages::-webkit-scrollbar-track {
  background: #ddd;
}
.messages::-webkit-scrollbar-thumb {
  background: #aaa;
}
</style>