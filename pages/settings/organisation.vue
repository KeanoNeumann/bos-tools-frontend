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
    <h1 class="text-h4 mb-6">Organisationsverwaltung</h1>

    <v-card v-if="organizations?.length > 1">
      <v-card-title>Ihre Organisationen</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="organizations"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" size="small" @click="editOrganization(item)">
              Bearbeiten
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card v-else-if="organizations?.length === 1">
      <v-card-title>Ihre Organisation</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveOrganization" ref="form">
          <v-text-field
            v-model="editedOrganization.name"
            label="Name"
            required
            :rules="[(v) => !!v || 'Name ist erforderlich']"
          ></v-text-field>
          <v-select
            v-model="editedOrganization.type"
            :items="organizationTypes"
            label="Typ"
            required
            :rules="[(v) => !!v || 'Typ ist erforderlich']"
          ></v-select>
          <v-text-field
            v-model="editedOrganization.address"
            label="Adresse"
          ></v-text-field>
          <v-text-field
            v-model="editedOrganization.city"
            label="Stadt"
          ></v-text-field>
          <v-text-field
            v-model="editedOrganization.postal_code"
            label="Postleitzahl"
          ></v-text-field>
          <v-text-field
            v-model="editedOrganization.state"
            label="Bundesland"
          ></v-text-field>
          <v-text-field
            v-model="editedOrganization.country"
            label="Land"
          ></v-text-field>
          <v-text-field
            v-model="editedOrganization.phone"
            label="Telefon"
          ></v-text-field>
          <v-text-field
            v-model="editedOrganization.email"
            label="E-Mail"
            type="email"
            :rules="[
              (v) => !v || /.+@.+\..+/.test(v) || 'E-Mail muss gültig sein',
            ]"
          ></v-text-field>
          <v-text-field
            v-model="editedOrganization.website"
            label="Website"
            :rules="[
              (v) =>
                !v ||
                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
                  v
                ) ||
                'Website muss gültig sein',
            ]"
          ></v-text-field>
          <v-textarea
            v-model="editedOrganization.description"
            label="Beschreibung"
          ></v-textarea>
          <v-btn type="submit" color="primary" class="mt-4" :loading="loading">
            Speichern
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-card-title>Keine Organisationen gefunden</v-card-title>
      <v-card-text>
        Sie haben derzeit keine Organisationen. Bitte kontaktieren Sie den
        Administrator.
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="saveOrganization" ref="dialogForm">
            <v-text-field
              v-model="editedOrganization.name"
              label="Name"
              required
              :rules="[(v) => !!v || 'Name ist erforderlich']"
            ></v-text-field>
            <v-select
              v-model="editedOrganization.type"
              :items="organizationTypes"
              label="Typ"
              required
              :rules="[(v) => !!v || 'Typ ist erforderlich']"
            ></v-select>
            <v-text-field
              v-model="editedOrganization.address"
              label="Adresse"
            ></v-text-field>
            <v-text-field
              v-model="editedOrganization.city"
              label="Stadt"
            ></v-text-field>
            <v-text-field
              v-model="editedOrganization.postal_code"
              label="Postleitzahl"
            ></v-text-field>
            <v-text-field
              v-model="editedOrganization.state"
              label="Bundesland"
            ></v-text-field>
            <v-text-field
              v-model="editedOrganization.country"
              label="Land"
            ></v-text-field>
            <v-text-field
              v-model="editedOrganization.phone"
              label="Telefon"
            ></v-text-field>
            <v-text-field
              v-model="editedOrganization.email"
              label="E-Mail"
              type="email"
              :rules="[
                (v) => !v || /.+@.+\..+/.test(v) || 'E-Mail muss gültig sein',
              ]"
            ></v-text-field>
            <v-text-field
              v-model="editedOrganization.website"
              label="Website"
              :rules="[
                (v) =>
                  !v ||
                  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
                    v
                  ) ||
                  'Website muss gültig sein',
              ]"
            ></v-text-field>
            <v-textarea
              v-model="editedOrganization.description"
              label="Beschreibung"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Abbrechen</v-btn>
          <v-btn color="blue darken-1" text @click="saveOrganization"
            >Speichern</v-btn
          >
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

const router = useRouter();
const form = ref(null);
const dialogForm = ref(null);
const loading = ref(false);
const dialog = ref(false);
const editedIndex = ref(-1);

const organizationTypes = [
  "Freiwillige Feuerwehr",
  "Berufsfeuerwehr",
  "Werkfeuerwehr",
];

const headers = [
  { title: "Name", key: "name" },
  { title: "Typ", key: "type" },
  { title: "Stadt", key: "city" },
  { title: "Aktionen", key: "actions", sortable: false },
];

const organizations = ref([]);
const editedOrganization = ref({
  name: "",
  type: "",
  address: "",
  city: "",
  postal_code: "",
  state: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  description: "",
});

const defaultOrganization = {
  name: "",
  type: "",
  address: "",
  city: "",
  postal_code: "",
  state: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  description: "",
};

const snackbar = ref({
  show: false,
  text: "",
  color: "",
});

const client = useSanctumClient();
const user = useSanctumUser();

onMounted(async () => {
  try {
    const res = await useAsyncData("organisation", () =>
      client(`/api/${user.value.tenant_id}/organisation/all/admin`)
    );

    organizations.value = res.data.value;
    if (organizations.value.length === 1) {
      editedOrganization.value = { ...organizations.value[0] };
    }
  } catch (error) {
    console.error("Fehler beim Laden der Organisationen:", error);
  }
});

const formTitle = computed(() => {
  return editedIndex.value === -1
    ? "Neue Organisation"
    : "Organisation bearbeiten";
});

const editOrganization = (item) => {
  editedIndex.value = organizations.value.indexOf(item);
  editedOrganization.value = Object.assign({}, item);
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
  editedOrganization.value = Object.assign({}, defaultOrganization);
  editedIndex.value = -1;
};

const saveOrganization = async () => {
  try {
    loading.value = true;

    // Updating existing organization
    await client(
      `/api/${user.value.tenant_id}/organisation/${editedOrganization.value.id}/update`,
      {
        method: "POST",
        body: editedOrganization.value,
      }
    );

    if (organizations.value.length > 1) {
      Object.assign(
        organizations.value[editedIndex.value],
        editedOrganization.value
      );
    } else {
      organizations.value[0] = { ...editedOrganization.value };
    }

    showToast("Organisation erfolgreich aktualisiert", "success");
    dialog.value = false;
  } catch (err) {
    showToast(
      err.data?.message ||
        "Ein Fehler ist beim Aktualisieren der Organisation aufgetreten",
      "error"
    );
  } finally {
    loading.value = false;
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