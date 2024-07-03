<template>
    <v-container>
      <h1 class="text-h4 mb-6">Alarmierungen</h1>
  
      <!-- Filter and Search -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="Suche"
            prepend-inner-icon="mdi-magnify"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            label="Status"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="dateRangeText"
                label="Datumsbereich"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateRange"
              range
              @update:model-value="updateDateRange"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
  
      <!-- Alarms Table -->
      <v-data-table
        :headers="headers"
        :items="filteredAlarms"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            size="small"
            class="me-2"
            @click="viewAlarmDetails(item.id)"
          >
            mdi-eye
          </v-icon>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';

  definePageMeta({
  layout: "app",
});
  
  const search = ref('');
  const selectedStatus = ref('');
  const dateRange = ref([]);
  const dateMenu = ref(false);
  const dateRangeText = ref('');
  
  const statusOptions = ['Aktiv', 'Abgeschlossen', 'Abgebrochen'];
  
  const headers = [
    { title: 'ID', align: 'start', key: 'id' },
    { title: 'Datum', align: 'start', key: 'date' },
    { title: 'Typ', align: 'start', key: 'type' },
    { title: 'Beschreibung', align: 'start', key: 'description' },
    { title: 'Status', align: 'start', key: 'status' },
    { title: 'Aktionen', align: 'center', key: 'actions', sortable: false },
  ];
  
  // Mock data for alarms
  const alarms = ref([
    { id: 1, date: '2024-06-30', type: 'Feuer', description: 'Küchenbrand', status: 'Aktiv' },
    { id: 2, date: '2024-06-29', type: 'Hilfeleistung', description: 'Verkehrsunfall', status: 'Abgeschlossen' },
    // Add more mock data as needed
  ]);
  
  const filteredAlarms = computed(() => {
    return alarms.value.filter(alarm => {
      const statusMatch = !selectedStatus.value || alarm.status === selectedStatus.value;
      const dateMatch = !dateRange.value.length || (new Date(alarm.date) >= new Date(dateRange.value[0]) && new Date(alarm.date) <= new Date(dateRange.value[1]));
      return statusMatch && dateMatch;
    });
  });
  
  function getStatusColor(status) {
    switch (status) {
      case 'Aktiv': return 'warning';
      case 'Abgeschlossen': return 'success';
      case 'Abgebrochen': return 'error';
      default: return 'grey';
    }
  }
  
  function viewAlarmDetails(id) {
    // Implement navigation to alarm details page
    console.log(`View details for alarm ${id}`);
  }
  
  function updateDateRange(newDateRange) {
    dateRange.value = newDateRange;
    dateRangeText.value = newDateRange.join(' - ');
    dateMenu.value = false;  // Close the menu after selection
  }
  </script>
  
  <style scoped>
  /* Add any additional custom styles here */
  </style>