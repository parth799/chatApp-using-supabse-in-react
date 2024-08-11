class LocalStorageService {
  //? This class is a wrapper around the Browser's LocalStorage API
  //? The goal here is to store information to minimise DB reads
  //? If the data is yet to expire then it would be returned
  //? Else NULL would be returned which prompts a DB call.

  constructor() {
    this.prefix = "react-chat-app-";
  }

  fetchData({ key, expiresIn = Number.MAX_SAFE_INTEGER }) {
    const cachedData = JSON.parse(localStorage.getItem(this.prefix + key));

    if (cachedData) {
      const { data, timestamp } = cachedData;
      const currentTime = Date.now();

      if (currentTime - timestamp <= expiresIn) {
        return data;
      }
    }
    return null;
  }

  setData({ key, data }) {
    const cachedData = {
      data: data,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(cachedData));
  }

  removeData(key) {
    localStorage.removeItem(this.prefix + key);
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
