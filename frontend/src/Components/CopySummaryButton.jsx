import { useState } from "react";
import moment from "moment";
import { convertUtcUser } from "../helpers";

const CopySummaryButton = ({
  total,
  totalHours,
  totalHoursRemarks,
  data,
  header,
  remarksList,
  cargoList,
  updateBargeList,
}) => {
  const [copied, setCopied] = useState(false);

  const remarksText = `Remarks
    Description               Start                 End                   Total
    ${remarksList
      .map((item) => {
        const desc = item.descriptions?.padEnd(25, " ");
        const start = convertUtcUser(item?.start)?.padEnd(20, " ");
        const end = convertUtcUser(item?.end)?.padEnd(20, " ");
        const startA = new Date(item?.start);
        const endA = new Date(item?.end);

        const diffMs = endA - startA;
        const totalMinutes = Math.floor(diffMs / (1000 * 60)); // total minutes

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const hhmm = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}`;

        return `${desc}${start}${end}${hhmm}`;
      })
      .join("\n")}
`;

  const cargoPerBargeText =
    "Cargo per Barge:\n" +
    data.map((item) => `${item.name}\t${item.cargoOnb}`).join("\n");

  const updateBargeText =
    "Update Barge:\n" +
    "No\tTug Boat\tBarge\tCargo\tRemarks\n" +
    updateBargeList
      ?.map(
        (item) =>
          `${item.no}\t${item.name}\t${item.barge}\t${item.cargo}\t${
            item.remarks || ""
          }`
      )
      .join("\n");

  const cargoPerHoldText = `Cargo per Hold
  No               KJB                 HAA                   Total
  ${cargoList
    .map((item) => {
      const desc = item.no.toString().padEnd(25, " ");
      const kjb = item.kjb.padEnd(20, " ");
      const haa = item.haa.padEnd(20, " ");
      const total = Number(item.kjb) + Number(item.haa);

      return `${desc}${kjb}${haa}${total}`;
    })
    .join("\n")}
  `;

  const summaryText = `SUMMARY

  Discharge, ${header?.dischargingPort}
  Stowage Plan :	${header?.stowagePlan}
  ${header?.tendered} :	${moment(header?.norTendered).format("DD-MM-YYYY HH:mm")}
  Previous Cargo :	${header?.prevCargo}
  Cargo Onboard :	${total}
  Balance Cargo :	${parseFloat(header?.stowagePlan - total).toFixed(3)}
  Loading Rate DTD :	${header?.loadingRateDTD}
  Loading Rate PTD :	 ${header?.loadingRatePTD}
  TPH :	${parseFloat(total / (totalHours - totalHoursRemarks)).toFixed(3)}
  Commanced Loading :	${moment(data[0]?.commanced).format("DD-MM-YYYY HH:mm")}
  Est Commpleted Loading :	${moment(header?.completedLoading).format(
    "yyyy-MM-DD HH:mm"
  )}

 
  ${remarksText}

  ${cargoPerBargeText}

  ${cargoPerHoldText}

  ${updateBargeText}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset setelah 2 detik
    } catch (err) {
      // fallback untuk browser lama
      const el = document.createElement("textarea");
      el.value = summaryText;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn btn-${copied ? "success" : "primary"}`}
    >
      {copied ? "Summary Tersalin!" : "Copy Summary"}
    </button>
  );
};

export default CopySummaryButton;
