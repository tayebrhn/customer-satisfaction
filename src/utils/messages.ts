export type Lang = "am" | "en";

export const messages = {
  loading: {
    am: {
      title: "እየተጫነ ነው…",
      description: "መረጃዎችን እየጫንን ነው። እባክዎ ትንሽ ይጠብቁ።",
    },
    en: {
      title: "Loading surveys…",
      description: "Please wait while we load the surveys.",
    },
  },

  error: {
    am: {
      title: "መረጃዎችን ማምጣት አልተቻለም",
      description: "የመረጃ ግንኙነትዎን ይመርምሩ እና እንደገና ይሞክሩ።",
      action: "እንደገና ሞክር",
    },
    en: {
      title: "Unable to load surveys",
      description: "Please check your internet connection and try again.",
      action: "Retry",
    },
  },

  empty: {
    am: {
      title: "ምንም ጥናት አልተገኘም",
      description: "በአሁኑ ጊዜ የሚገኙ ጥናቶች የሉም።",
    },
    en: {
      title: "No surveys available",
      description: "There are no surveys available at the moment.",
    },
  },
};
