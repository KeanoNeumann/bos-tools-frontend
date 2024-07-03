<template>
    <v-container class="termine-page">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 mb-6 text-center text-primary">Termine</h1>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              Termin erstellen
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="createTermin">
                <v-text-field
                  v-model="newTermin.title"
                  label="Titel"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="newTermin.description"
                  label="Beschreibung"
                ></v-textarea>
                <v-date-picker
                  v-model="newTermin.date"
                  label="Datum"
                  required
                ></v-date-picker>
                <v-time-picker
                  v-model="newTermin.time"
                  label="Uhrzeit"
                  format="24hr"
                  required
                ></v-time-picker>
                <v-btn
                  type="submit"
                  color="primary"
                  block
                  class="mt-4"
                >
                  Termin erstellen
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-h6">
              Terminübersicht
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="formattedTermine"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.date="{ item }">
                  {{ item.formattedDate }}
                </template>
                <template v-slot:item.time="{ item }">
                  {{ item.formattedTime }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    small
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const newTermin = ref({
    title: '',
    description: '',
    date: new Date().toISOString().substr(0, 10), // Aktuelles Datum im Format YYYY-MM-DD
    time: new Date().toTimeString().substr(0, 5) // Aktuelle Zeit im Format HH:MM
  })
  
  const headers = [
    { title: 'Titel', key: 'title' },
    { title: 'Beschreibung', key: 'description' },
    { title: 'Datum', key: 'date' },
    { title: 'Uhrzeit', key: 'time' },
    { title: 'Aktionen', key: 'actions', sortable: false }
  ]
  
  const termine = ref([
    {
      title: 'Übungsdienst',
      description: 'Monatlicher Übungsdienst für alle Einsatzkräfte',
      date: '2024-07-15',
      time: '19:00'
    },
    {
      title: 'Erste-Hilfe-Kurs',
      description: 'Auffrischung der Erste-Hilfe-Kenntnisse',
      date: '2024-08-02',
      time: '09:00'
    }
  ])
  
  const formattedTermine = computed(() => {
    return termine.value.map(termin => ({
      ...termin,
      formattedDate: new Date(termin.date).toLocaleDateString('de-DE'),
      formattedTime: termin.time
    }))
  })
  
  const createTermin = () => {
    termine.value.push({
      ...newTermin.value,
      date: new Date(newTermin.value.date).toISOString().substr(0, 10),
      time: newTermin.value.time
    })
    newTermin.value = {
      title: '',
      description: '',
      date: new Date().toISOString().substr(0, 10),
      time: new Date().toTimeString().substr(0, 5)
    }
  }
  
  const editItem = (item) => {
    // Implementierung der Bearbeitungsfunktion
    console.log('Bearbeite:', item)
  }
  
  const deleteItem = (item) => {
    const index = termine.value.findIndex(t => 
      t.title === item.title && 
      t.date === item.date && 
      t.time === item.time
    )
    if (index !== -1) {
      termine.value.splice(index, 1)
    }
  }
  </script>
  
  <style scoped>
  .termine-page {
    @apply py-8;
  }
  </style>