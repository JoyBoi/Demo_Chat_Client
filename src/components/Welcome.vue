<template>
  <b-container fluid class="welcome">
    <b-card
      bg-variant="light"
      text-variant="primary"
      title="Welcome"
      title-tag="h1"
      class="text-center"
    >
      <div class="text-dark">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group
            id="input-group-1"
            label="User Name:"
            label-for="input-1"
            label-size="sm"
            class="text-left font-weight-lighter"
          >
            <b-form-input
              id="input-1"
              v-model="form.username"
              placeholder="Enter Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-2"
            label="Room Name:"
            label-for="input-2"
            label-size="sm"
            class="text-left font-weight-lighter"
          >
            <b-form-select
              id="input-2"
              v-model="form.roomid"
              :options="rooms"
              required
            ></b-form-select>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Welcome",
  data() {
    return {
      form: {
        username: "",
        roomid: null,
      },
    };
  },
  computed: {
    ...mapState({
      rooms: (state) => state.rooms,
    }),
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      var selectedRoom = this.$store.getters.getRoomName(this.form.roomid);
      // alert(JSON.stringify(this.form));
      await this.$store.dispatch("getRoomData", { value: this.form.roomid });
      // this.$socket.auth = { username: this.form.username };
      await this.$socket.connect();
      await this.$socket.emit("joinRoom", {
        username: this.form.username,
        room: selectedRoom.text,
      });
      this.$router.push({ name: "Room", params: { id: this.form.roomid } });
    },
    onReset(event) {
      event.preventDefault();
      this.form.username = "";
      this.form.roomid = null;
    },
  },
};
</script>

<style scoped>
.welcome {
  max-width: 500px;
  margin-top: 25px;
  margin-bottom: 25px;
}
.welcome button {
  margin: 30px 35px;
}
</style>