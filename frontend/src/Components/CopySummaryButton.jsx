import React, { useState } from "react";

const CopySummaryButton = ({ data }) => {
  const [copied, setCopied] = useState(false);

  console.log(data);
  const total = data.detail.reduce((acc, item) => acc + item.cargoOnb, 0);

  const cargoPerBargeText = `Cargo per Barge :
${data.detail.map((item) => `${item.name}\t${item.cargoOnb}`).join("\n")}
`;
  const updateBargeText = `Update Barge :
No\tTug Boat\tBarge\tCargo\tRemarks
${data.detail
  .map(
    (item, index) =>
      `${item.no}\t${item.tugBoat}\t${item.barge}\t${item.cargoOnb}\t${
        item.remarks || ""
      }`
  )
  .join("\n")}
`;

  const summaryText = `SUMMARY				
				
Discharge, ${data.dischargingPort}			
Stowage Plan :	${data.stowagePlan}		
NOR Tendered :	${data.norTendered}		
Previous Cargo :	-			
Cargo Onboard :	${total}		
Balance Cargo :	${data.stowagePlan - total}		
Loading Rate DTD :	-			
Loading Rate PTD :	 ${(total * 24) / 12} 			
TPH :	982			
Commanced Loading :	211025 19:00			
Est Commpleted Loading :	261025 19:00			
				
Remarks :				
Description	Start	End	Nett	
Heavy Rain	201025 19:45	201025 20:45	00:01:00 	
Waiting Barge	201025 23:45	211025 08:45	00:09:00 	
				
${cargoPerBargeText}
		
Cargo per Hold :				
H1				
KJB :				
HAA :				
Total :				
H2				
KJB :				
HAA :				
Total :				
H3				
KJB :				
HAA :				
Total :				
H4				
KJB :				
HAA :				
Total :				
H5				
KJB :				
HAA :				
Total :				
H6				
KJB :				
HAA :				
Total :				
H7				
KJB :				
HAA :				
Total :				
				
${updateBargeText}	`;

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
      {copied ? "✅ SUMMARY Tersalin!" : "📋 Copy SUMMARY"}
    </button>
  );
};

export default CopySummaryButton;
