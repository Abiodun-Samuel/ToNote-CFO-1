export const unslugify = (slug) => {
  const result = slug.replace(/-/g, " ");
  return result.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const randomId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const randomNumber = (length) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// generate a dynamic uid for agora
export const generateUid = (string) => {
  return slugify(string) + "#" + randomId(5);
};

// generate display name from generated uid
export const generateName = (string) => {
  let unslug = unslugify(string);
  return unslug.split("#")[0];
};

// check device os
export const platformInitiated = () => {
  let mobilePlatforms = [
    "iPhone",
    "iPod",
    "iPad",
    "Android",
    "BlackBerry",
    "Opera",
  ];
  let typeOfOS = window.navigator.platform;
  if (mobilePlatforms.includes(typeOfOS)) {
    return "Mobile";
  } else {
    return "Web";
  }
};

const log = console.log.bind(console);

const removeDiv = function (selector) {
  let element = document.getElementById(selector);
  if (element === null) {
    return null;
  } else {
    element.remove();
  }
};

export { log, removeDiv };
