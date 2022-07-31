import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * USER DATA
 */
extractUserData = async () => {
  let result = null;

  try {
    let data = await AsyncStorage.getItem('user');
    let user = JSON.parse(data) || {};

    if (Object.getOwnPropertyNames(user).length > 0) {
      result = {
        user: user,
        access_token: await AsyncStorage.getItem('access_token'),
        expires_at: await AsyncStorage.getItem('expires_at')
      }
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

removeUserData = async () => {
  let result = false;

  try {
    AsyncStorage.removeItem('user');

    let data = await AsyncStorage.getItem('user');
    let user = JSON.parse(data) || {};

    if (Object.getOwnPropertyNames(user).length === 0) {
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('expires_at');

      result = true;
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

validateUserData = async () => {
  let result = false;

  try {
    let data = await AsyncStorage.getItem('user');
    let user = JSON.parse(data) || {};

    if (Object.getOwnPropertyNames(user).length > 0) {
      result = true;
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

/**
 * FILE TYPE
 */
getFileMIMEType = (extension) => {
  let response = null;

  switch (extension) {
    case "doc":
    case "docx":
      response = "application/msword";
      break;
    case "jpg":
      response = "image/jpg";
      break;
    case "jpeg":
      response = "image/jpeg";
      break;
    case "png":
      response = "image/png";
      break;
    case "pdf":
      response = "application/pdf";
      break;
    case "xls":
    case "xlsx":
      response = "application/vnd.ms-excel";
      break;
  }

  return response;
}

/**
 * CONVERT BASE64 TO BLOB
 */
blobCreationFromURL = (inputURI) => {
  var binaryVal;

  // mime extension
  var inputMIME = inputURI.split(',')[0].split(':')[1].split(';')[0];

  // Extraer parte de lamURL y convertirar en un balor binario
  if (inputURI.split(',')[0].indexOf('base64') >= 0)
    binaryVal = Base64.atob(inputURI.split(',')[1]);

  // Decodificar el string codificado base64
  else
    binaryVal = unescape(inputURI.split(',')[1]);

  // Almacenamiento de bytes del string en un tipo array
  var blobArray = [];
  for (var index = 0; index < binaryVal.length; index++) {
    blobArray.push(binaryVal.charCodeAt(index));
  }

  return new Blob([blobArray], {
    type: inputMIME
  });
}

/**
 * ENCODE AND DECODE BASE64
 */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input = '') => {
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || (map = '=', i % 1);
      output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

      charCode = str.charCodeAt(i += 3 / 4);

      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }

      block = block << 8 | charCode;
    }

    return output;
  },

  atob: (input = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
};

/**
 * DATE TIME FUNCTIONS
 */
timeDiffCalc = (dateFuture, dateNow) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = '';
  if (days > 0) {
    difference += (days === 1) ? `${days} día, ` : `${days} dias, `;
  }

  difference += (hours === 0 || hours === 1) ? `${hours} hora con ` : `${hours} horas con `;

  difference += (minutes === 0 || hours === 1) ? `${minutes} minutos` : `${minutes} minutos`;

  return difference;
}

const Actions = {
  extractUserData, removeUserData, validateUserData, getFileMIMEType, blobCreationFromURL, Base64, timeDiffCalc
}

export default Actions;