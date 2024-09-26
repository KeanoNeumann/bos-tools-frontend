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

    <h1 class="text-h4 mb-6">Benutzerverwaltung</h1>

    <v-card class="mb-6" v-if="organisations.length > 1">
      <v-card-title>Organisation auswählen</v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedOrganisationId"
          :items="organisations"
          item-title="name"
          item-value="id"
          label="Organisation"
          @change="fetchUsers"
        ></v-select>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Benutzer</span>
        <v-btn color="primary" @click="openInviteUserDialog">
          Benutzer einladen
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="users" :items-per-page="10">
          <template v-slot:item.organisations="{ item }">
            {{ item.organisations.map((org) => org.name).join(", ") }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editUser(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteUser(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog für Benutzereinladung -->
    <v-dialog v-model="inviteDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Benutzer einladen</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="sendInvitation">
            <v-text-field
              v-model="invitedUser.email"
              label="E-Mail"
              type="email"
              required
            ></v-text-field>
            <v-select
              v-model="invitedUser.organisation_ids"
              v-if="organisations.length > 1"
              :items="organisations"
              item-title="name"
              item-value="id"
              label="Organisationen"
              multiple
              chips
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeInviteDialog">
            Abbrechen
          </v-btn>
          <v-btn color="blue darken-1" text @click="sendInvitation">
            Einladung senden
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog zur Bestätigung des Löschens -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Benutzer löschen</v-card-title>
        <v-card-text>
          Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?
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
  </v-container>
</template>
  
  <script setup>
definePageMeta({
  layout: "app",
});

const config = useRuntimeConfig();
const user = useSanctumUser();
const client = useSanctumClient();

const users = ref([]);
const organisations = ref([]);
const userDialog = ref(false);
const deleteDialog = ref(false);
const editedIndex = ref(-1);
const inviteDialog = ref(false);
const invitedUser = ref({
  email: "",
  organisation_ids: [],
});

const editedUser = ref({
  name: "",
  email: "",
  password: "",
  organisation_ids: [],
});

const selectedOrganisationId = ref(null);

const headers = [
  { title: "Name", key: "name" },
  { title: "E-Mail", key: "email" },
  { title: "Organisationen", key: "organisations" },
  { title: "Aktionen", key: "actions", sortable: false },
];

const isTenantAdmin = computed(() => user.value.tenant_id !== null);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Neuer Benutzer" : "Benutzer bearbeiten";
});

onMounted(async () => {
  // Hole Organisationen von User
  // Bearbeiten der User der jeweiligen Tenants
  // Wenn Tenant-Admin -> Hole alle Organisationen & User des Tenants -> alles administrieren
  // Erstellen / Bearbeiten / Löschen von Usern pro Tenant
  try {
    const response = await client(
      `/api/${user.value.tenant_id}/organisation/all/admin`
    );

    organisations.value = response;
    if (organisations.value.length > 0) {
      selectedOrganisationId.value = organisations.value[0].id;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Organisationen:", error);
  }
});

watch(selectedOrganisationId, async (newValue, oldValue) => {
  if (newValue !== oldValue) {
    await fetchUsers();
  }
});

const fetchUsers = async () => {
  try {
    const response = await client(
      `/api/${user.value.tenant_id}/user/${selectedOrganisationId.value}/all`
    );
    users.value = response;
  } catch (error) {
    console.error("Fehler beim Laden der Benutzer:", error);
  }
};

const openInviteUserDialog = () => {
  invitedUser.value = {
    email: "",
    organisation_ids: [selectedOrganisationId.value],
  };
  inviteDialog.value = true;
};

const closeInviteDialog = () => {
  inviteDialog.value = false;
};

const sendInvitation = async () => {
  try {
    const invitationData = {
      email: invitedUser.value.email,
      organisation_ids: invitedUser.value.organisation_ids,
    };

    const response = await client("/api/invitations", {
      method: "POST",
      body: invitationData,
    });

    // Zeige eine Erfolgsmeldung an
    alert("Einladung erfolgreich gesendet!");

    closeInviteDialog();
    await fetchUsers(); // Aktualisiere die Benutzerliste, falls nötig
  } catch (error) {
    console.error("Fehler beim Senden der Einladung:", error);
    // Hier könnten Sie eine Fehlermeldung für den Benutzer anzeigen
    alert("Fehler beim Senden der Einladung. Bitte versuchen Sie es erneut.");
  }
};

const editUser = (item) => {
  editedIndex.value = users.value.indexOf(item);
  editedUser.value = Object.assign({}, item);
  editedUser.value.password = ""; // Leere das Passwortfeld beim Bearbeiten
  editedUser.value.organisation_ids = item.organisations.map((org) => org.id);
  userDialog.value = true;
};

const deleteUser = (item) => {
  editedIndex.value = users.value.indexOf(item);
  editedUser.value = Object.assign({}, item);
  deleteDialog.value = true;
};

const closeUserDialog = () => {
  userDialog.value = false;
  editedIndex.value = -1;
};

const confirmDelete = async () => {
  try {
    await client.delete(`/api/users/${editedUser.value.id}`);
    users.value.splice(editedIndex.value, 1);
    deleteDialog.value = false;
  } catch (error) {
    console.error("Fehler beim Löschen des Benutzers:", error);
    // Hier könnten Sie eine Fehlermeldung für den Benutzer anzeigen
  }
};
</script>