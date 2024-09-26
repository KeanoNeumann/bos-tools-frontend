<template>
  <v-container class="settings-container">
    <h1 class="text-h3 font-weight-bold mb-6 text-center">Einstellungen</h1>
    <v-row class="fill-height">
      <v-col
        v-for="setting in visibleSettings"
        :key="setting.title"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :disabled="setting.disabled"
            :elevation="isHovering && !setting.disabled ? 8 : 2"
            :class="{ 'on-hover': isHovering && !setting.disabled }"
            @click="changePage(setting)"
            class="d-flex flex-column"
            style="width: 100%"
          >
            <div class="d-flex flex-column align-center pa-6 flex-grow-1">
              <v-icon
                :icon="setting.icon"
                size="64"
                :color="setting.disabled ? 'grey' : setting.color"
                class="mb-4"
              />
              <h2 class="text-h5 font-weight-bold mb-2">{{ setting.title }}</h2>
              <p class="text-body-1 text-center flex-grow-1">
                {{ setting.description }}
              </p>
              <v-chip
                v-if="setting.disabled"
                color="grey"
                text-color="white"
                class="mt-2"
              >
                Nicht verfügbar
              </v-chip>
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  
    <script setup>
definePageMeta({
  layout: "app",
});

const user = useSanctumUser();

const settings = [
  {
    title: "Tenant",
    description: "Verwalten Sie Ihren Tenant und Organisationen.",
    icon: "mdi-domain",
    color: "secondary",
    route: "/settings/tenant",
    disabled: false,
    requiresTenantId: true,
  },
  {
    title: "Organisation",
    description: "Verwalten Sie Ihre Organisation.",
    icon: "mdi-fire-station",
    color: "primary",
    route: "/settings/organisation",
    disabled: false,
  },
  {
    title: "Benutzer",
    description: "Verwalten Sie Benutzerkonten.",
    icon: "mdi-account",
    color: "primary",
    route: "/settings/user",
    disabled: false,
  },
  {
    title: "Gruppen",
    description:
      "Organisieren Sie Benutzer in Gruppen für einfachere Verwaltung.",
    icon: "mdi-account-group",
    color: "primary",
    route: "/settings/groups",
    disabled: false,
  },
  {
    title: "Rollen",
    description:
      "Definieren und verwalten Sie Benutzerrollen und Berechtigungen.",
    icon: "mdi-shield-account",
    color: "success",
    route: "/settings/rollen",
    disabled: true,
  },
  {
    title: "Benachrichtigungen",
    description:
      "Konfigurieren Sie Benachrichtigungseinstellungen für das System.",
    icon: "mdi-bell-outline",
    color: "info",
    route: "/settings/benachrichtigungen",
    disabled: true,
  },
  {
    title: "Sicherheit",
    description:
      "Verwalten Sie Sicherheitseinstellungen und Zugriffskontrollen.",
    icon: "mdi-security",
    color: "warning",
    route: "/settings/sicherheit",
    disabled: true,
  },
  {
    title: "Integration",
    description: "Konfigurieren Sie Integrationen mit anderen Systemen.",
    icon: "mdi-application-import",
    color: "error",
    route: "/settings/integration",
    disabled: true,
  },
];

const visibleSettings = computed(() => {
  return settings.filter((setting) => {
    if (setting.requiresTenantId) {
      console.log(user);
      return user.value.tenant_admin;
    }
    return true;
  });
});

const changePage = async (setting) => {
  if (!setting.disabled) {
    console.log("Navigating to:", setting.route);
    navigateTo(setting.route);
  } else {
    console.log("This setting is currently disabled");
  }
};
</script>
    
  <style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
}

.v-card {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.v-card.on-hover {
  transform: translateY(-5px);
}

.v-card:not(.on-hover) {
  opacity: 0.9;
}

.v-card.v-card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
  