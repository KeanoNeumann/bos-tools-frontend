<!-- pages/index.vue -->
<template>
  <v-container fluid class="dashboard pa-6">
    <!-- Header Section -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">BOS-Tools Dashboard</h1>
      </v-col>
    </v-row>

    <!-- Alert Section -->
    <v-row>
      <v-col cols="12">
        <v-alert
          prominent
          type="warning"
          variant="tonal"
          border="start"
          elevation="2"
          icon="mdi-alert-circle"
          class="mb-6"
        >
          <v-row align="center">
            <v-col class="grow">
              <strong>Einsatzalarm:</strong> Großbrand in Industriegebiet Nord.
              Alle verfügbaren Einheiten alarmiert.
            </v-col>
            <v-col class="shrink">
              <v-btn color="warning">Details anzeigen</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Quick Stats Section -->
    <v-row>
      <v-col
        v-for="stat in quickStats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card :color="stat.color" dark>
          <v-card-text>
            <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
            <div>{{ stat.title }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text">Mehr Info</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Section -->
    <v-row class="mt-6">
      <!-- Latest Updates -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="headline">
            Aktuelle Meldungen
            <v-spacer></v-spacer>
            <v-btn icon="mdi-refresh"></v-btn>
          </v-card-title>
          <v-card-text>
            <v-timeline align="start" truncate-line="both">
              <v-timeline-item
                v-for="update in latestUpdates"
                :key="update.id"
                :dot-color="update.color"
                size="small"
              >
                <template v-slot:opposite>
                  <div class="text-caption">{{ update.time }}</div>
                </template>
                <div>
                  <div class="text-h6">{{ update.title }}</div>
                  <div>{{ update.content }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quick Links and Upcoming Events -->
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-title class="headline">Schnellzugriff</v-card-title>
          <v-list>
            <v-list-item
              v-for="link in quickLinks"
              :key="link.title"
              :to="link.to"
            >
              <template v-slot:prepend>
                <v-icon :icon="link.icon"></v-icon>
              </template>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card>
          <v-card-title class="headline">
            Anstehende Termine
            <v-spacer></v-spacer>
            <v-btn icon="mdi-calendar"></v-btn>
          </v-card-title>
          <v-list>
            <v-list-item v-for="event in upcomingEvents" :key="event.id">
              <template v-slot:prepend>
                <v-avatar :color="event.color" size="40">
                  {{ event.date }}
                </v-avatar>
              </template>
              <v-list-item-title>{{ event.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ event.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "app",
  middleware: ["sanctum:auth"],
});

const quickStats = [
  { title: "Aktive Einsatzkräfte", value: "157", color: "primary" },
  { title: "Einsatzfahrzeuge", value: "23", color: "secondary" },
  { title: "Laufende Einsätze", value: "3", color: "warning" },
  { title: "Ausbildungsstunden", value: "1.240", color: "success" },
];

const latestUpdates = [
  {
    id: 1,
    title: "Neue Ausrüstung eingetroffen",
    content: "Neue Atemschutzgeräte und Schutzkleidung wurden geliefert.",
    time: "Vor 2 Stunden",
    color: "green",
  },
  {
    id: 2,
    title: "Schulung geplant",
    content: "Pflichtschulung zur Einsatztaktik für nächste Woche angesetzt.",
    time: "Vor 5 Stunden",
    color: "blue",
  },
  {
    id: 3,
    title: "Fahrzeugwartung abgeschlossen",
    content:
      "Routinewartung des Löschfahrzeugs LF 20 erfolgreich durchgeführt.",
    time: "Gestern",
    color: "orange",
  },
];

const quickLinks = [
  { title: "Dienstplan", icon: "mdi-calendar-clock", to: "/dienstplan" },
  { title: "Ausrüstungsverwaltung", icon: "mdi-toolbox", to: "/ausruestung" },
  {
    title: "Einsatzberichte",
    icon: "mdi-file-document",
    to: "/einsatzberichte",
  },
  { title: "Ausbildungsmodule", icon: "mdi-school", to: "/ausbildung" },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Atemschutzübung",
    date: "15",
    time: "09:00 Uhr",
    color: "primary",
  },
  {
    id: 2,
    title: "Führungskräftebesprechung",
    date: "22",
    time: "14:00 Uhr",
    color: "secondary",
  },
  {
    id: 3,
    title: "Fahrzeugüberprüfung",
    date: "30",
    time: "10:00 Uhr",
    color: "success",
  },
];
</script>

<style scoped>
.dashboard {
  background-color: #f5f5f5;
}
</style>