// PDF generation utility — browser-only.
// jspdf-autotable must be called as autoTable(doc, options) when using
// dynamic imports — the side-effect augmentation pattern doesn't work.

export const generateQuotePdf = async (quote: any): Promise<void> => {
  if (typeof window === "undefined") return;

  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Header band ──────────────────────────────────────────────────────────
  doc.setFillColor(184, 151, 90); // Signature Gold
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("SIGNATURE 8", 15, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("SKETCH DESIGN STUDIO", 15, 32);

  // ── Document reference ───────────────────────────────────────────────────
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("DEVIS", pageWidth - 15, 60, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date(quote.date_emission || quote.created_at).toLocaleDateString("fr-FR");
  doc.text(`N° : ${quote.numero_devis}`, pageWidth - 15, 68, { align: "right" });
  doc.text(`Date : ${dateStr}`, pageWidth - 15, 73, { align: "right" });

  // ── Parties ──────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ÉMETTEUR :", 15, 85);
  doc.setFont("helvetica", "normal");
  doc.text("Signature 8", 15, 92);
  doc.text("Casablanca, Maroc", 15, 97);
  doc.text("Contact : +212 600-000000", 15, 102);

  doc.setFont("helvetica", "bold");
  doc.text("DESTINATAIRE :", 120, 85);
  doc.setFont("helvetica", "normal");
  doc.text(quote.projets?.clients?.nom_complet || "Client Non Spécifié", 120, 92);
  doc.text(`Projet : ${quote.projets?.nom_projet ?? "—"}`, 120, 97);

  // ── Line items table — standalone function call ───────────────────────────
  autoTable(doc, {
    startY: 120,
    head: [["Désignation", "Qté", "P.U. HT (MAD)", "Total HT (MAD)"]],
    body: [
      [
        `Prestation Design — ${quote.projets?.nom_projet ?? "Projet"}`,
        "1",
        Number(quote.montant_ht).toLocaleString("fr-FR"),
        Number(quote.montant_ht).toLocaleString("fr-FR"),
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [184, 151, 90],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 8 },
    margin: { left: 15, right: 15 },
  });

  // ── Totals block ──────────────────────────────────────────────────────────
  const finalY = (doc as any).lastAutoTable.finalY + 12;
  const tva = Number(quote.montant_ht) * 0.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  doc.text("Total HT :", pageWidth - 70, finalY);
  doc.text(`${Number(quote.montant_ht).toLocaleString("fr-FR")} MAD`, pageWidth - 15, finalY, { align: "right" });

  doc.text("TVA (20 %) :", pageWidth - 70, finalY + 8);
  doc.text(`${tva.toLocaleString("fr-FR")} MAD`, pageWidth - 15, finalY + 8, { align: "right" });

  // Gold separator line
  doc.setDrawColor(184, 151, 90);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 80, finalY + 12, pageWidth - 15, finalY + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(184, 151, 90);
  doc.text("TOTAL TTC :", pageWidth - 70, finalY + 20);
  doc.text(`${Number(quote.montant_ttc).toLocaleString("fr-FR")} MAD`, pageWidth - 15, finalY + 20, { align: "right" });

  // ── Notes ────────────────────────────────────────────────────────────────
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("NOTES :", 15, finalY + 40);
  doc.setFont("helvetica", "italic");
  doc.text(quote.notes || "Aucune clause particulière.", 15, finalY + 47, { maxWidth: 180 });

  // ── Footer stripe ─────────────────────────────────────────────────────────
  doc.setFillColor(184, 151, 90);
  doc.rect(0, 278, pageWidth, 1, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text("Conditions : 50 % à la commande, solde à la livraison.", 15, 285);
  doc.text("Validité : 30 jours à compter de la date d'émission.", pageWidth - 15, 285, { align: "right" });

  doc.save(`DEVIS_${quote.numero_devis}.pdf`);
};
