<!-- pages/register/[token].vue -->
<template>
  <div
    class="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-500"
  >
    <v-card class="w-full sm:w-96 px-8 py-10 text-center rounded-xl shadow-2xl">
      <v-img src="/logo.png" class="mx-auto mb-6 h-20 object-contain"></v-img>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">
        Feuerwehr Registrierung
      </h2>
      <p class="text-gray-600 mb-6">Vervollständigen Sie Ihre Registrierung.</p>
      <v-form @submit.prevent="register">
        <v-text-field
          v-model="name"
          label="Name"
          :rules="[rules.required]"
          class="mb-4"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          color="red-darken-2"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Passwort"
          :append-inner-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required]"
          @click:append-inner="showPassword = !showPassword"
          variant="outlined"
          color="red-darken-2"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          v-model="password_confirmation"
          label="Passwort bestätigen"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, passwordConfirmationRule]"
          variant="outlined"
          color="red-darken-2"
          class="mb-6"
        ></v-text-field>
        <v-btn
          block
          color="red-darken-2"
          :loading="loading"
          @click="register"
          class="mb-4 py-2 text-lg font-semibold"
          elevation="2"
          type="submit"
        >
          Registrieren
        </v-btn>
      </v-form>
      <p class="text-sm text-gray-600">
        Bereits ein Konto?
        <a href="/login" class="text-orange-700 hover:underline">Anmelden</a>
      </p>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      color="red-darken-2"
      rounded="pill"
    >
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
const client = useSanctumClient();
const route = useRoute();
const router = useRouter();

const name = ref("");
const password = ref("");
const password_confirmation = ref("");
const showPassword = ref(false);
const loading = ref(false);
const snackbar = ref(false);
const errorMessage = ref("");

const rules = {
  required: (value) => !!value || "Dieses Feld ist erforderlich.",
};

const passwordConfirmationRule = (value) =>
  value === password.value || "Die Passwörter stimmen nicht überein.";

const register = async () => {
  loading.value = true;
  try {
    const response = await client("/register", {
      method: "POST",
      body: JSON.stringify({
        name: name.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
        invitation_token: route.params.token,
      }),
    });
    if (response.ok) {
      // Registration successful, redirect to login or dashboard
      router.push("/");
    } else {
      // Handle errors
      const data = await response.json();
      errorMessage.value =
        "Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.";
      snackbar.value = true;
      console.error(data.errors);
    }
  } catch (error) {
    errorMessage.value =
      "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
    snackbar.value = true;
    console.error("Registration failed", error);
  } finally {
    loading.value = false;
  }
};
</script>