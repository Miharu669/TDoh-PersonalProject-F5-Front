import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomeView from "../views/HomeView.vue";
import TaskView from "../views/TaskView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/tasks",
      name: "tasks",
      component: TaskView,
    }
    
    
  ],
});

router.beforeEach((to, from) => {
  const store = useAuthStore();

  if (localStorage.getItem("username") && store.user.username == "") {
    store.user.id = localStorage.getItem("id");
    store.user.username = localStorage.getItem("username");
    store.user.isAuthenticated = localStorage.getItem("isAuthenticated") == "true" ? true : false;
    store.user.token = localStorage.getItem("token");
  }

  if (to.meta.requiresAuth && !store.user.isAuthenticated) {
    return {
      path: "/home",
    };
  }
});

export default router;
