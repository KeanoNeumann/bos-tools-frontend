<template>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <!-- Seitenleiste -->
        <v-col cols="12" md="3" lg="2" class="bg-gray-100 min-h-screen">
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-folder" title="Alle Dateien" value="all"></v-list-item>
            <v-list-item prepend-icon="mdi-star" title="Favoriten" value="favorites"></v-list-item>
            <v-list-item prepend-icon="mdi-delete" title="Papierkorb" value="trash"></v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item prepend-icon="mdi-folder-multiple" title="Meine Ordner" value="folders"></v-list-item>
          </v-list>
        </v-col>
  
        <!-- Hauptbereich -->
        <v-col cols="12" md="9" lg="10" class="pa-6">
          <h1 class="text-h4 mb-6">Dateien</h1>
  
          <!-- Suchleiste und Aktionen -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="8">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                label="Dateien durchsuchen"
                single-line
                hide-details
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" class="d-flex justify-end">
              <v-btn color="primary" prepend-icon="mdi-upload">
                Hochladen
              </v-btn>
              <v-btn class="ml-2" variant="outlined" prepend-icon="mdi-folder-plus">
                Neuer Ordner
              </v-btn>
            </v-col>
          </v-row>
  
          <!-- Dateiliste -->
          <v-card>
            <v-data-table
              :headers="headers"
              :items="files"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item.icon="{ item }">
                <v-icon :color="item.color">{{ item.icon }}</v-icon>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
definePageMeta({
  layout: "app",
});


  const headers = [
    { title: '', key: 'icon', sortable: false, width: '48px' },
    { title: 'Name', key: 'name' },
    { title: 'Geändert', key: 'modified' },
    { title: 'Größe', key: 'size' },
    { title: 'Aktionen', key: 'actions', sortable: false, align: 'end' },
  ]
  
  const files = [
    { icon: 'mdi-folder', color: 'amber', name: 'Dokumente', modified: '10.03.2024', size: '-' },
    { icon: 'mdi-file-pdf-box', color: 'red', name: 'Bericht.pdf', modified: '15.03.2024', size: '2.5 MB' },
    { icon: 'mdi-file-excel', color: 'green', name: 'Tabelle.xlsx', modified: '20.03.2024', size: '1.8 MB' },
    { icon: 'mdi-file-image', color: 'blue', name: 'Foto.jpg', modified: '25.03.2024', size: '3.2 MB' },
  ]
  
  const editItem = (item) => {
    // Implementieren Sie hier die Logik zum Bearbeiten eines Elements
    console.log('Bearbeite:', item.name)
  }
  
  const deleteItem = (item) => {
    // Implementieren Sie hier die Logik zum Löschen eines Elements
    console.log('Lösche:', item.name)
  }
  </script>
  
  <style scoped>
  /* Zusätzliche Stile können hier hinzugefügt werden */
  </style>