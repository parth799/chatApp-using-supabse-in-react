// import supabaseAnonKey from "../lib/config";
import client from "./_init";
import localStorageService from "./localStorageService";

//? This is the AuthService class that deals with user authentication

class AuthService {
  constructor() {
    this.client = client;
  }

  async signUp({ email, password }, name) {
    const { data, signUpError } = await this.client.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw new Error(signUpError.message);

    const { _, updateError } = await this.client.auth.updateUser({
      data: { display_name: name },
    });

    if (updateError) throw new Error(updateError.message);
    //? refer to key design decisions pt1 to understand the use of next line
    this._updateContacts({ email, userId: data.user.id });
    return data;
  }

  async signIn({ email, password }) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new Error(error.message);
    //? refer to key design decisions pt1 to understand the use of next line
    this._updateContacts({ email, userId: data.user.id });
    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut({ scope: "local" });
    if (error) throw new Error(error.message);
    localStorageService.removeData("user");
    localStorageService.removeData("channels");
    localStorageService.removeData("contacts");
    localStorageService.removeData("sessionId");
  }

  async getCurrentUser() {
    const cacheData = localStorageService.fetchData({ key: "user" });
    if (cacheData) return cacheData;

    const { data, error } = await this.client.auth.getUser();
    if (error) throw new Error(error.message);

    localStorageService.setData({ key: "user", data });
    return data;
  }

  async _updateContacts({ email, userId }) {
    const { error } = await this.client
      .from("contacts")
      .update({ contact_id: String(userId) })
      .eq("contact_email", email)
      .is("contact_id", null);

    if (error) throw Error(error);
  }
}

const authService = new AuthService();
export default authService;
