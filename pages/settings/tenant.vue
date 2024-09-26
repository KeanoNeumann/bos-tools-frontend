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

    <h1 class="text-h4 mb-6">Tenant-Verwaltung</h1>

    <!-- Tenant Name -->
    <v-card class="mb-6">
      <v-card-title>Tenant-Name</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="tenantName"
          label="Tenant-Name"
          @blur="updateTenantName"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <!-- Organisationen -->
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Organisationen</span>
        <v-btn color="primary" @click="openNewOrgDialog">
          Neue Organisation
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="organizations"
          :items-per-page="5"
        >
          <template v-slot:item.active="{ item }">
            <v-icon :color="item.active ? 'green' : 'red'">
              {{ item.active ? "mdi-check" : "mdi-close" }}
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editOrganization(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteOrganization(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog für neue/bearbeitete Organisation -->
    <v-dialog v-model="orgDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveOrganization">
            <v-text-field
              v-model="editedOrg.name"
              label="Name"
              required
            ></v-text-field>
            <v-select
              v-model="editedOrg.type"
              :items="orgTypes"
              label="Typ"
            ></v-select>
            <v-text-field
              v-model="editedOrg.address"
              label="Adresse"
            ></v-text-field>
            <v-text-field v-model="editedOrg.city" label="Stadt"></v-text-field>
            <v-text-field
              v-model="editedOrg.postal_code"
              label="Postleitzahl"
            ></v-text-field>
            <v-text-field
              v-model="editedOrg.state"
              label="Bundesland"
            ></v-text-field>
            <v-text-field
              v-model="editedOrg.country"
              label="Land"
            ></v-text-field>
            <v-text-field
              v-model="editedOrg.phone"
              label="Telefon"
            ></v-text-field>
            <v-text-field
              v-model="editedOrg.email"
              label="E-Mail"
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="editedOrg.website"
              label="Website"
            ></v-text-field>
            <v-textarea
              v-model="editedOrg.description"
              label="Beschreibung"
            ></v-textarea>
            <v-switch v-model="editedOrg.active" label="Aktiv"></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeOrgDialog">
            Abbrechen
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveOrganization">
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog zur Bestätigung des Löschens -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5"> Organisation löschen </v-card-title>
        <v-card-text>
          Sind Sie sicher, dass Sie diese Organisation löschen möchten?
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

// CONFIG

const config = useRuntimeConfig();
const user = useSanctumUser();
const client = useSanctumClient();

// IMPORTS

const tenantName = ref("");
const organizations = ref([]);
const orgDialog = ref(false);
const deleteDialog = ref(false);
const editedIndex = ref(-1);
const editedOrg = ref({
  name: "",
  type: null,
  address: "",
  city: "",
  postal_code: "",
  state: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  description: "",
  active: true,
});

const orgTypes = [
  "Freiwillige Feuerwehr",
  "Berufsfeuerwehr",
  "Werkfeuerwehr",
  "Sonstiges",
];

const headers = [
  { title: "Name", key: "name" },
  { title: "Typ", key: "type" },
  { title: "Stadt", key: "city" },
  { title: "Land", key: "country" },
  { title: "Aktiv", key: "active", align: "center" },
  { title: "Aktionen", key: "actions", sortable: false },
];

// Add snackbar
const snackbar = ref({
  show: false,
  text: "",
  color: "",
});

// INIT

let res = await useAsyncData("tenant", () =>
  client(`/api/tenant/${user.value.tenant_id}`)
);

tenantName.value = res.data.value.name;

res = await useAsyncData("organisation", () =>
  client(`/api/${user.value.tenant_id}/organisation/all/admin`)
);

organizations.value = res.data.value;

// COMPUTED

const formTitle = computed(() => {
  return editedIndex.value === -1
    ? "Neue Organisation"
    : "Organisation bearbeiten";
});

// METHODS

const updateTenantName = async () => {
  // API-Aufruf zum Aktualisieren des Tenant-Namens
  // z.B. await api.updateTenantName(tenantName.value);
};

const openNewOrgDialog = () => {
  editedIndex.value = -1;
  editedOrg.value = {
    name: "",
    // Weitere Eigenschaften zurücksetzen
  };
  orgDialog.value = true;
};

const editOrganization = (item) => {
  editedIndex.value = organizations.value.indexOf(item);
  editedOrg.value = Object.assign({}, item);
  editedOrg.value.active = editedOrg.value.active === 1;
  orgDialog.value = true;
};

const deleteOrganization = (item) => {
  editedIndex.value = organizations.value.indexOf(item);
  editedOrg.value = Object.assign({}, item);
  deleteDialog.value = true;
};

const closeOrgDialog = () => {
  orgDialog.value = false;
  editedIndex.value = -1;
};

const saveOrganization = () => {
  if (editedIndex.value > -1) {
    // API-Aufruf zum Aktualisieren der Organisation
    client(
      `/api/${user.value.tenant_id}/organisation/${editedOrg.value.id}/update`,
      {
        method: "POST",
        body: editedOrg.value,
      }
    )
      .then(() => {
        Object.assign(organizations.value[editedIndex.value], editedOrg.value);
        showToast("Organisation erfolgreich aktualisiert", "success");
        closeOrgDialog();
      })
      .catch((err) => {
        showToast(err.data.message, "error");
      });
  } else {
    // API-Aufruf zum Erstellen einer neuen Organisation
    client(`/api/${user.value.tenant_id}/organisation`, {
      method: "PUT",
      body: editedOrg.value,
    })
      .then((res) => {
        organizations.value.push(res.organisation);
        closeOrgDialog();
        showToast("Neue Organisation erfolgreich erstellt", "success");
      })
      .catch((err) => {
        showToast(err.data.message, "error");
      });
  }
};

const confirmDelete = async () => {
  try {
    // API-Aufruf zum Löschen der Organisation
    await client(
      `/api/${user.value.tenant_id}/organisation/${editedOrg.value.id}`,
      {
        method: "DELETE",
      }
    );
    organizations.value.splice(editedIndex.value, 1);
    deleteDialog.value = false;
    showToast("Organisation erfolgreich gelöscht", "success");
  } catch (error) {
    showToast("Fehler beim Löschen der Organisation", "error");
    console.error("Error deleting organization:", error);
  }
};

const showToast = (message, color) => {
  snackbar.value = {
    show: true,
    text: message,
    color: color,
  };
};
</script>