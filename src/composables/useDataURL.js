import { randomId } from "@/utils/helper";
const query = randomId(10);

export const useConvertToBase64Composable = () => {
  function toBase64(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url + "?" + query);
    xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
    xhr.responseType = "blob";
    xhr.send();
  }
  return { toBase64 };
};
