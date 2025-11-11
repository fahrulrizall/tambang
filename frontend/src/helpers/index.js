import moment from "moment";

function convertUtc(params) {
  if (!params) {
    return;
  }
  return moment.utc(params).add(7, "hours").format("yyyy-MM-DDTHH:mm");
}

export { convertUtc };
