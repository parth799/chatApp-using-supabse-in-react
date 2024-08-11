import client from "./_init";
import localStorageService from "./localStorageService";

class ContactService {
  constructor() {
    this.client = client
  }

  // async getAllContacts({ userId }) {
  //   console.log("🚀 ~ getAllContacts called with userId:", userId);
  
  //   // Log that cache data was not found or expired
  //   console.log("⚠️ ~ Cache data not found or expired, fetching from Supabase...");
  
  //   try {
  
  //     // Build the query to fetch contacts
  //     const { data, error } = await this.client
  //       .from("contacts")
  //       .select("*")
  //       .or(`user_id.eq.${userId}`);

  
  //     // Log the query result
  //     console.log("🚀 ~ Supabase query result:", data);
  
  //     if (error) {
  //       console.error("❌ ~ Error fetching contacts:", error);
  //       throw new Error(error.message);
  //     }
  
  //     // Cache the retrieved data
  //     localStorageService.setData({ key: "contacts", data });
  //     console.log("✅ ~ Contacts data cached successfully");
  
  //     // Return the fetched data
  //     return data;
  
  //   } catch (err) {
  //     // Catch any errors thrown during the execution
  //     console.error("❌ ~ Error in getAllContacts function:", err);
  //     throw err;
  //   }
  // }




  async getAllContacts({ userId }) {
    const cacheData = localStorageService.fetchData({
      key: "contacts",
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });
  console.log(cacheData);
    // if (cacheData) return cacheData;

    // const { data, error } = await this.client
    //   .from("contacts")
    //   .select("id, contact_email, contact_name, contact_id")
    //   .eq("user_id", userId)
    //   .neq("contact_id", null);

    const { data, error } = await this.client
        .from("contacts")
        .select("*")
        .or(`user_id.eq.${userId}`);

    if (error) throw Error(error);

    localStorageService.setData({ key: "contacts", data: data });
    console.log(data)
    return data;
  }

  async addContact({ userId, email, nickname }) {
    const { data, error } = await this.client
      .from("contacts")
      .insert([{ user_id: userId, contact_name: nickname, contact_email: email }]);

    if (error) throw new Error(error.message);

    localStorageService.removeData("contacts");
    return data;
  }
}

const contactService = new ContactService();
export default contactService;