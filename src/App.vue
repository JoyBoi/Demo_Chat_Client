<template>
  <div id="app" class="d-flex flex-column">
    <NavBar />
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <div class="container py-5 flex-grow-1">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { mapActions } from "vuex";

export default {
  components: {
    NavBar,
    Footer,
  },
  methods: {
    ...mapActions(["getRoomList"]),
  },
  beforeCreate() {
    this.$store.dispatch("getRoomList");
  },
  created() {
    // this.$socket.on("connect_error", (err) => {
    //   if (err.message === "invalid username") {
    //     console.log(err);
    //   }
    // });
  },
};
</script>

<style lang="scss">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
