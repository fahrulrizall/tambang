const CSM = "CSM";
const MTM = "MTM";
const MaterialType = [
  {
    value: "Non MSC Purseine",
    label: "Non MSC Purseine",
  },
  {
    value: "MSC Non Pacifical",
    label: "MSC Non Pacifical",
  },
  {
    value: "MSC Pacifical",
    label: "MSC Pacifical",
  },
  {
    value: "Long Line FIP",
    label: "Long Line FIP",
  },
  {
    value: "Long Line MSC",
    label: "Long Line MSC",
  },
];
const Origin = [
  {
    value: "MH",
    label: "MH (Marshall Island)",
  },
  {
    value: "PG",
    label: "PG (Papua New Guinea)",
  },
  {
    value: "FM",
    label: "FM (Micronesia)",
  },
  {
    value: "KI",
    label: "KI (Kiribati)",
  },
  {
    value: "NR",
    label: "NR (Nauru)",
  },
  {
    value: "SB",
    label: "SB (Solomon Islands)",
  },
  {
    value: "CN",
    label: "CN (China)",
  },
  {
    value: "PP",
    label: "PP (Pacific Ocean)",
  },
  {
    value: "FJ",
    label: "FJ (Fiji)",
  },
];
const Certificate = [
  {
    value: "FT",
    label: "Fairtrade",
  },
  {
    value: "NFT",
    label: "Non Fairtrade",
  },
  {
    value: "MSC",
    label: "MSC",
  },
  {
    value: "MSC/FT",
    label: "MSC Fairtade",
  },
];
const Fleet = [
  {
    value: "OBC",
    label: "OBC",
  },
  {
    value: "TWA",
    label: "TWA",
  },
  {
    value: "SUL",
    label: "SUL",
  },
];
const RawMaterial = [
  {
    value: "GG",
    label: "GG",
  },
  {
    value: "CL",
    label: "CL",
  },
  {
    value: "DL",
    label: "DL",
  },
];
const Action = {
  CREATE: "CREATE",
  VIEW: "VIEW",
  EDIT: "EDIT",
  DELETE: "DELETE",
};

export {
  CSM,
  MTM,
  MaterialType,
  Origin,
  Certificate,
  Fleet,
  RawMaterial,
  Action,
};
