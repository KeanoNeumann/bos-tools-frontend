// layouts/app.vue
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
      <v-avatar size="32">
        <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Avatar">
      </v-avatar>
    </v-app-bar>

    <!-- Main Content -->
    <v-main :style="{ backgroundColor: colors.lightGray }">
      <v-container fluid class="pa-0 h-full">
        <v-row no-gutters class="h-full">
          <!-- Combined Left Menu -->
          <v-navigation-drawer
            permanent
            :rail="!isExpanded"
            :color="colors.darkGray"
            @mouseenter="isExpanded = true"
            @mouseleave="isExpanded = false"
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

          <!-- Content Area -->
          <v-col>
            <slot></slot>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer :color="colors.darkGray" class="justify-center" height="50">
      <span>&copy; {{ new Date().getFullYear() }} BOS-Tools. All rights reserved.</span>
    </v-footer>
  </v-app>
</div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)

const colors = {
  primaryRed: '#D32F2F',
  secondaryOrange: '#FF5722',
  darkGray: '#424242',
  lightGray: '#EEEEEE',
  white: '#FFFFFF',
  accentYellow: '#FFC107',
}

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/' },
  { title: 'Alarmierungen', icon: 'mdi-alarm-light', path: '/alarmierungen' },
  { title: 'Termine', icon: 'mdi-calendar', path: '/termine' },
  // { title: 'Personalverwaltung', icon: 'mdi-account-group', path: '/personal' },
  // { title: 'Ausrüstung', icon: 'mdi-toolbox', path: '/ausruestung' },
  // { title: 'Fahrzeuge', icon: 'mdi-fire-truck', path: '/fahrzeuge' },
  // { title: 'Einsatzberichte', icon: 'mdi-file-document', path: '/einsatzberichte' },
  // { title: 'Ausbildung', icon: 'mdi-school', path: '/ausbildung' },
  // { title: 'Umfragen', icon: 'mdi-poll', path: '/umfragen' },
  // { title: 'Chats', icon: 'mdi-message', path: '/chats' },
  { title: 'Dokumente', icon: 'mdi-folder', path: '/dokumente' },
  // { title: 'Schnittstellen', icon: 'mdi-connection', path: '/schnittstellen' },
  // { title: 'Tenant-Verwaltung', icon: 'mdi-domain', path: '/tenant' },
  { title: 'Einstellungen', icon: 'mdi-cog', path: '/einstellungen' },
]
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