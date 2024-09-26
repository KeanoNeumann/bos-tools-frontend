<template>
  <v-container>
    <v-btn
      color="primary"
      class="mb-4"
      @click="navigateTo('/settings')"
      prepend-icon="mdi-arrow-left"
    >
      Zurück
    </v-btn>
    <h1 class="text-h4 mb-6">Gruppenverwaltung</h1>

    <v-card class="mb-6" v-if="userOrganizations.length > 1">
      <v-card-title>Organisation auswählen</v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedOrganization"
          :items="userOrganizations"
          item-title="name"
          item-value="id"
          label="Organisation"
          @update:model-value="loadGroups"
        ></v-select>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Gruppen</span>
        <v-btn
          color="primary"
          @click="openDialog"
          :disabled="!selectedOrganization"
        >
          Neue Gruppe
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="groups"
          :loading="loading"
          :items-per-page="10"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveItem" ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Gruppenname"
              required
              :rules="[(v) => !!v || 'Name ist erforderlich']"
            ></v-text-field>
            <!-- Fügen Sie hier weitere Felder hinzu, wenn nötig -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Abbrechen
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveItem">
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Gruppe löschen</v-card-title>
        <v-card-text>
          Sind Sie sicher, dass Sie diese Gruppe löschen möchten?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">
            Abbrechen
          </v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">
            Löschen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom right"
    >
      <div class="text-center">{{ snackbar.text }}</div>
    </v-snackbar>
  </v-container>
</template>
  
  <script setup>
definePageMeta({
  layout: "app",
});

definePageMeta({
  layout: "app",
});

const router = useRouter();
const form = ref(null);
const loading = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const editedIndex = ref(-1);

const headers = [
  { title: "ID", key: "id" },
  { title: "Name", key: "name" },
  { title: "Aktionen", key: "actions", sortable: false },
];

const userOrganizations = ref([]);
const selectedOrganization = ref(null);
const groups = ref([]);
const editedItem = ref({
  id: null,
  name: "",
});
const defaultItem = {
  id: null,
  name: "",
};

const snackbar = ref({
  show: false,
  text: "",
  color: "",
});

const client = useSanctumClient();
const user = useSanctumUser();

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Neue Gruppe" : "Gruppe bearbeiten";
});

onMounted(async () => {
  await loadUserOrganizations();
  if (userOrganizations.value.length === 1) {
    selectedOrganization.value = userOrganizations.value[0].id;
    await loadGroups();
  }
});

async function loadUserOrganizations() {
  try {
    const res = await useAsyncData("organisations", () =>
      client(`/api/${user.value.tenant_id}/organisation/all/admin`)
    );
    userOrganizations.value = res.data.value;
  } catch (error) {
    console.error("Fehler beim Laden der Organisationen:", error);
    showToast("Fehler beim Laden der Organisationen", "error");
  }
}

async function loadGroups() {
  if (!selectedOrganization.value) return;

  loading.value = true;
  try {
    const res = await useAsyncData("groups", () =>
      client(
        `/api/${user.value.tenant_id}/organisation/${selectedOrganization.value}/groups`
      )
    );
    groups.value = res.data.value;
  } catch (error) {
    console.error("Fehler beim Laden der Gruppen:", error);
    showToast("Fehler beim Laden der Gruppen", "error");
  } finally {
    loading.value = false;
  }
}

function openDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
}

function editItem(item) {
  editedIndex.value = groups.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
}

function deleteItem(item) {
  editedIndex.value = groups.value.indexOf(item);
  editedItem.value = { ...item };
  deleteDialog.value = true;
}

async function confirmDelete() {
  try {
    await client(`/api/group/${editedItem.value.id}`, {
      method: "DELETE",
    });
    groups.value.splice(editedIndex.value, 1);
    showToast("Gruppe erfolgreich gelöscht", "success");
    closeDeleteDialog();
  } catch (error) {
    console.error("Fehler beim Löschen der Gruppe:", error);
    showToast("Fehler beim Löschen der Gruppe", "error");
  }
}

function closeDeleteDialog() {
  deleteDialog.value = false;
  editedItem.value = { ...defaultItem };
  editedIndex.value = -1;
}

async function saveItem() {
  if (!form.value.validate()) return;

  try {
    loading.value = true;
    if (editedIndex.value > -1) {
      // Gruppe aktualisieren
      await client(`/api/group/${editedItem.value.id}`, {
        method: "POST",
        body: editedItem.value,
      });
      Object.assign(groups.value[editedIndex.value], editedItem.value);
      showToast("Gruppe erfolgreich aktualisiert", "success");
    } else {
      // Neue Gruppe erstellen
      const response = await client(`/api/group`, {
        method: "PUT",
        body: {
          ...editedItem.value,
          organisation_id: selectedOrganization.value,
        },
      });
      groups.value.push(response.group);
      showToast("Gruppe erfolgreich erstellt", "success");
    }
    closeDialog();
  } catch (error) {
    console.error("Fehler beim Speichern der Gruppe:", error);
    showToast(
      error.data?.message || "Fehler beim Speichern der Gruppe",
      "error"
    );
  } finally {
    loading.value = false;
  }
}

function showToast(message, color) {
  snackbar.value = {
    show: true,
    text: message,
    color: color,
  };
}

function navigateTo(path) {
  router.push(path);
}
</script>