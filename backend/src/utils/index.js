const jwt_decode = require("jwt-decode");
const moment = require("moment");

const convertToCsv = (data) => {
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) => headers.map((header) => obj[header]));
  const csvArray = [headers, ...rows];
  return csvArray.map((row) => row.join(",")).join("\n");
};

const handleSizeReceiving = (size) => {
  switch (size) {
    case 10:
      return "10 Kg Down";
    case 20:
      return "10 - 20 Kg";
    case 30:
      return "20 - 30 kg";
    default:
      return "30 Kg Up";
  }
};

const handleSizeTrimming = (value) => {
  value = parseInt(value);
  if (value < 1) {
    return "1 Down";
  } else if (value >= 1 && value < 2) {
    return "1 Up";
  } else if (value >= 2 && value < 3) {
    return "2 Up";
  } else {
    return "3 Up";
  }
};

const handleReceivingSequence = (data) => {
  if (data < 10) {
    return `${"000" + data}`;
  } else if (data >= 10 && data < 100) {
    return `${"00" + data}`;
  } else if (data >= 100 && data < 1000) {
    return `${"0" + data}`;
  } else {
    return `${data}`;
  }
};

const handleTrimmingSequence = (data) => {
  if (data < 10) {
    return `${"0" + data}`;
  } else {
    return `${data}`;
  }
};

const handleFishCode = (vendorCode, date, sequence1, sequence2, type) => {
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear().toString().substring(2);

  if (month < 10) {
    return `${vendorCode}.0${month + year}.${handleReceivingSequence(
      sequence1
    )}${sequence2 ? `.${handleTrimmingSequence(sequence2)}` : ""}${
      type ? `.${type}` : ""
    }`;
  } else {
    return `${vendorCode}.${month + year}.${handleReceivingSequence(
      sequence1
    )}${sequence2 ? `.${handleTrimmingSequence(sequence2)}` : ""}${
      type ? `.${type}` : ""
    }`;
  }
};

const handleSizeRetouching = (size) => {
  if (size < 3) {
    return "1-3 Lbs";
  } else if (size >= 3 && size < 5) {
    return "3-5 Lbs";
  } else {
    return "5 Lbs Up";
  }
};

const handleTypeRetouching = (value) => {
  switch (value) {
    case "A":
      return "FULL";
    case "B":
      return "HEAD";
    default:
      return "TAIL";
  }
};

const addLeadingZero = (number, digits) => {
  let numString = number.toString();
  while (numString.length < digits) {
    numString = "0" + numString;
  }
  return numString;
};

const handlePackingCase = (date, caseNo) => {
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear().toString().substring(2);

  return `MT-${year}${addLeadingZero(month, 2)}.${addLeadingZero(caseNo, 4)}`;
};

const decodeToken = (req, item) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);
  return decodedToken[item];
};

const handleSizeCSMReceiving = (weight) => {
  if (weight < 10) {
    return "10Kg Down";
  } else if (weight >= 10 && weight < 15) {
    return "10 - 15Kg";
  } else if (weight >= 15 && weight < 20) {
    return "15 - 20Kg";
  } else if (weight >= 20 && weight < 30) {
    return "20 - 30Kg";
  } else if (weight >= 30 && weight < 40) {
    return "30 - 40Kg";
  } else {
    return "40Kg Up";
  }
};

const handleSizeCSMTrimming = (weight) => {
  if (weight < 3) {
    return "0 - 3Kg";
  } else if (weight >= 3 && weight < 4) {
    return "3 - 4Kg";
  } else if (weight >= 4 && weight < 5) {
    return "4 - 5Kg";
  } else {
    return "5Kg Up";
  }
};

const handleSizeLBSRetouching = (weight) => {
  if (weight <= 1.37) {
    return "1-3 Lbs";
  } else if (weight > 1.37 && weight <= 2.27) {
    return "3-5 Lbs";
  } else {
    return "5Lbs Up";
  }
};

const UTCtoLocal = (date) => {
  var localTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
  localTime = moment.utc(localTime).toDate();
  localTime = moment(localTime).format("YYYY-MM-DD HH:mm:ss");
  return localTime;
};

module.exports = {
  convertToCsv,
  handleSizeLBSRetouching,
  handleSizeTrimming,
  handleFishCode,
  handleSizeRetouching,
  handleTypeRetouching,
  addLeadingZero,
  handleSizeReceiving,
  handlePackingCase,
  decodeToken,
  handleSizeCSMReceiving,
  handleSizeCSMTrimming,
  UTCtoLocal,
};
