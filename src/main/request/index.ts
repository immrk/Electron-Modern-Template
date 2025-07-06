// electron net 请求
import { net } from "electron";

export const netRequest = (option: any) => {
  return new Promise(async (resolve, reject) => {
    const request = net.request(option);
    let Data = {};
    request.on("response", (response) => {
      response.on("data", (chunk) => {
        Data = chunk;
      });
      response.on("end", () => {
        if (response.statusCode !== 200) {
          reject({
            response: {
              status: response.statusCode,
              data: Data,
            },
          });
        }
        resolve(Data);
      });
    });
    request.end();
  });
};
