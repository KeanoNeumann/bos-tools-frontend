<template>
  <div>
    <v-app>
      <!-- App Bar -->
      <v-app-bar :elevation="2" :color="colors.primaryRed">
        <v-app-bar-title>BOS-Tools Verwaltung</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-avatar
              size="50"
              v-bind="props"
              style="cursor: pointer"
              class="mx-4"
            >
              <img
                src="https://randomuser.me/api/portraits/men/85.jpg"
                alt="Avatar"
              />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>Abmelden</v-list-item-title>
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <!-- Main Content -->
      <v-main :style="{ backgroundColor: colors.lightGray }">
        <v-container fluid class="pa-0 h-full">
          <v-row no-gutters class="h-full">
            <!-- Combined Left Menu -->
            <client-only>
              <v-navigation-drawer
                permanent
                :rail="!isExpanded"
                :color="colors.darkGray"
                @mouseenter="expandDrawer"
                @mouseleave="shrinkDrawer"
                width="250"
              >
                <v-list>
                  <v-list-item
                    v-for="item in menuItems"
                    :key="item.title"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    :to="item.path"
                  ></v-list-item>
                </v-list>
              </v-navigation-drawer>
            </client-only>
            <!-- Content Area -->
            <v-col>
              <slot></slot>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <!-- Footer -->
      <v-footer :color="colors.darkGray" class="justify-center" height="50">
        <span
          >&copy; {{ new Date().getFullYear() }} BOS-Tools. All rights
          reserved.</span
        >
      </v-footer>
    </v-app>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isExpanded = ref(false);

const colors = {
  primaryRed: "#D32F2F",
  secondaryOrange: "#FF5722",
  darkGray: "#424242",
  lightGray: "#EEEEEE",
  white: "#FFFFFF",
  accentYellow: "#FFC107",
};

const menuItems = [
  { title: "Dashboard", icon: "mdi-view-dashboard", path: "/" },
  { title: "Alarmierungen", icon: "mdi-alarm-light", path: "/alarmierungen" },
  { title: "Termine", icon: "mdi-calendar", path: "/termine" },
  { title: "Dokumente", icon: "mdi-folder", path: "/dokumente" },
  { title: "Einstellungen", icon: "mdi-cog", path: "/settings" },
];

const expandDrawer = () => {
  isExpanded.value = true;
};

const shrinkDrawer = () => {
  isExpanded.value = false;
};

const logout = () => {
  const { logout } = useSanctumAuth();
  logout();
  navigateTo("/login");
};

onMounted(() => {
  // Any client-side only logic can go here
});
</script>

<style scoped>
.v-navigation-drawer {
  transition: 0.2s ease-in-out;
}
.v-footer {
  height: 50px;
  padding: 0 16px;
  font-size: 14px;
}
</style>