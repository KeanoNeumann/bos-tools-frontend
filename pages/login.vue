<template>
  <div
    class="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-500"
  >
    <v-card class="w-full sm:w-96 px-8 py-10 text-center rounded-xl shadow-2xl">
      <v-img src="/logo.png" class="mx-auto mb-6 h-20 object-contain"></v-img>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Feuerwehr Login</h2>
      <p class="text-gray-600 mb-6">Geben Sie Ihre Benutzerdaten ein.</p>

      <v-text-field
        v-model="username"
        label="E-Mail"
        :rules="[rules.required, rules.email]"
        class="mb-4"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        color="red-darken-2"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Passwort"
        :append-inner-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        :append-icon="capslock ? 'mdi-apple-keyboard-caps' : ''"
        :type="showPassword ? 'text' : 'password'"
        :rules="[rules.required]"
        @click:append-inner="showPassword = !showPassword"
        @keyup="capsLock"
        variant="outlined"
        color="red-darken-2"
      ></v-text-field>

      <div class="flex justify-between items-center mb-6">
        <v-checkbox
          label="Angemeldet bleiben"
          color="red-darken-2"
          hide-details
        ></v-checkbox>
        <a href="register" class="text-sm text-orange-700 hover:underline"
          >Passwort vergessen?</a
        >
      </div>

      <v-btn
        block
        color="red-darken-2"
        :loading="loading"
        @click="login"
        class="mb-4 py-2 text-lg font-semibold"
        elevation="2"
      >
        Anmelden
      </v-btn>

      <p class="text-sm text-gray-600">
        Noch kein Konto?
        <a href="/register" class="text-orange-700 hover:underline"
          >Registrieren</a
        >
      </p>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      color="red-darken-2"
      rounded="pill"
    >
      Die eingegebenen Benutzerdaten sind nicht korrekt.
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from "vue";

const loading = ref(false);
const snackbar = ref(false);
const username = ref("");
const password = ref("");
const capslock = ref(false);
const showPassword = ref(false);
const rules = ref({
  required: (value) => !!value || "Feld benötigt.",
  email: (v) =>
    v.match(/[A-Za-z0-9\-_.+]{1,64}@[A-Za-z0-9\-_.]+\.[a-zA-Z]+/) ||
    "Die E-Mail Adresse ist ungültig",
});

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/portal",
  },
});

async function login() {
  const { login } = useSanctumAuth();
  const credentials = {
    email: username.value,
    password: password.value,
    remember: true,
  };

  try {
    await login(credentials);
  } catch (e) {
    if (e.response?.status === 422) {
      snackbar.value = true;
    }
  }
}

function capsLock(event) {
  capslock.value = event.getModifierState("CapsLock");
}
</script>

<style scoped>
:deep(.v-field__outline__start),
:deep(.v-field__outline__end) {
  border-color: #424242 !important;
}

:deep(.v-field--focused .v-field__outline__start),
:deep(.v-field--focused .v-field__outline__end) {
  border-color: #d32f2f !important;
}

:deep(.v-label) {
  color: #424242 !important;
}

:deep(.v-field--focused .v-label) {
  color: #d32f2f !important;
}
</style>