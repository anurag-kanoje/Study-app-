export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    USER: "/api/auth/user",
  },
  NOTES: {
    GET_ALL: "/api/notes",
    CREATE: "/api/notes",
    UPDATE: "/api/notes",
    DELETE: "/api/notes",
  },
  SUMMARIZE: {
    TEXT: "/api/summarize/text",
    IMAGE: "/api/summarize/image",
    VIDEO: "/api/summarize/video",
  },
  CHAT: {
    SEND: "/api/chat",
    HISTORY: "/api/chat/history",
  },
  PARENTAL_CONTROLS: {
    GET: "/api/parental-controls",
    UPDATE: "/api/parental-controls",
  },
}

