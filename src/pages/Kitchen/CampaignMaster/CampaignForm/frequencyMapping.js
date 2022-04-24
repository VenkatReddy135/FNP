import range from "lodash/range";

export const FIELD_TYPES = {
  type: "type",
  repeat: "repeat",
  time: "time",
};

export const TWO_FIELD_OPERATOR = "BETWEEN";
export const ACTIVE = "ACTIVE";

export const TIME_OPTIONS = [
  ...range(0, 24).map((i) => {
    const time = i % 12 === 0 ? "12:00" : `${i % 12}:00`;
    return {
      id: i >= 12 ? `${time} PM` : `${time} AM`,
      name: i >= 12 ? `${time} PM` : `${time} AM`,
    };
  }),
];

/**
 * @function getNumberWithOrdinal to get ordinal suffix
 * @param {number} i number to format
 * @returns {string} formatted number
 */
export const getNumberWithOrdinal = (i) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
};

const datesWithOrdinal = range(1, 29).map((date) => getNumberWithOrdinal(date));

export const CAMPAIGN_FREQUENCY_MAPPING = {
  monthly: {
    label: "Monthly",
    value: "monthly",
    disableRepeat: false,
    disableTime: false,
    options: [...datesWithOrdinal],
  },
  weekly: {
    label: "Weekly",
    value: "weekly",
    disableRepeat: false,
    disableTime: false,
    options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  daily: {
    label: "Daily",
    value: "daily",
    disableRepeat: true,
    disableTime: false,
    options: [],
  },
  hourly: {
    label: "Hourly",
    value: "hourly",
    disableRepeat: true,
    disableTime: true,
    options: [],
  },
};
