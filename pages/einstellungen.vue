<template>
    <v-container class="settings-container">
      <h1 class="text-h3 font-weight-bold mb-6 text-center">Einstellungen</h1>
      <v-row>
        <v-col v-for="setting in settings" :key="setting.title" cols="12" sm="6" md="4">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :disabled="setting.disabled"
              :elevation="isHovering && !setting.disabled ? 8 : 2"
              :class="{ 'on-hover': isHovering && !setting.disabled }"
              @click="navigateTo(setting)"
            >
              <div class="d-flex flex-column align-center pa-6">
                <v-icon
                  :icon="setting.icon"
                  size="64"
                  :color="setting.disabled ? 'grey' : setting.color"
                  class="mb-4"
                />
                <h2 class="text-h5 font-weight-bold mb-2">{{ setting.title }}</h2>
                <p class="text-body-1 text-center">{{ setting.description }}</p>
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

  const settings = [
    {
      title: 'Benutzer',
      description: 'Verwalten Sie Benutzerkonten und Zugriffsrechte.',
      icon: 'mdi-account-group',
      color: 'primary',
      route: '/einstellungen/benutzer',
      disabled: false
    },
    {
      title: 'Gruppen',
      description: 'Organisieren Sie Benutzer in Gruppen für einfachere Verwaltung.',
      icon: 'mdi-account-group-outline',
      color: 'secondary',
      route: '/einstellungen/gruppen',
      disabled: false
    },
    {
      title: 'Rollen',
      description: 'Definieren und verwalten Sie Benutzerrollen und Berechtigungen.',
      icon: 'mdi-shield-account',
      color: 'success',
      route: '/einstellungen/rollen',
      disabled: true
    },
    {
      title: 'Benachrichtigungen',
      description: 'Konfigurieren Sie Benachrichtigungseinstellungen für das System.',
      icon: 'mdi-bell-outline',
      color: 'info',
      route: '/einstellungen/benachrichtigungen',
      disabled: true
    },
    {
      title: 'Sicherheit',
      description: 'Verwalten Sie Sicherheitseinstellungen und Zugriffskontrollen.',
      icon: 'mdi-security',
      color: 'warning',
      route: '/einstellungen/sicherheit',
      disabled: true
    },
    {
      title: 'Integration',
      description: 'Konfigurieren Sie Integrationen mit anderen Systemen.',
      icon: 'mdi-application-import',
      color: 'error',
      route: '/einstellungen/integration',
      disabled: true
    }
  ];
  
  const navigateTo = (setting) => {
    if (!setting.disabled) {
      // Implementieren Sie hier die Navigation-Logik
      console.log('Navigating to:', setting.route);
    } else {
      console.log('This setting is currently disabled');
      // Optional: Zeigen Sie hier eine Benachrichtigung an, dass die Einstellung nicht verfügbar ist
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