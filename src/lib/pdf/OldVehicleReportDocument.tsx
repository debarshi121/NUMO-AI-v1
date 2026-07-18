import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { TOldVehicleReportData } from "@/types/vehicleReport";
import { getAllUniqueColors } from "@/lib/numerology/engine/color-engine";
import { pdfColors } from "./theme";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    color: pdfColors.ink,
    fontFamily: "Helvetica",
  },
  brand: {
    fontSize: 10,
    color: pdfColors.primary,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  metaLine: {
    fontSize: 9,
    color: pdfColors.inkMuted,
    marginBottom: 2,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.border,
    paddingBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: pdfColors.surface,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  statBlock: {
    alignItems: "center",
    flexGrow: 1,
  },
  statLabel: {
    fontSize: 8,
    color: pdfColors.inkMuted,
    letterSpacing: 1,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.primary,
  },
  profileTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.primary,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 10,
    color: pdfColors.inkMuted,
    lineHeight: 1.5,
  },
  plate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: pdfColors.border,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  plateReg: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  plateNum: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.primary,
  },
  matchBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.primary,
    textAlign: "center",
  },
  scoreLabel: {
    fontSize: 8,
    color: pdfColors.inkMuted,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
  },
  tag: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.primary,
    borderWidth: 1,
    borderColor: pdfColors.primary,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: pdfColors.border,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: pdfColors.primary,
    marginRight: 6,
    marginTop: 4,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  noteBox: {
    backgroundColor: pdfColors.surface,
    borderRadius: 6,
    padding: 10,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: pdfColors.inkMuted,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: pdfColors.border,
    paddingTop: 8,
  },
});

export default function OldVehicleReportDocument({
  reportData,
}: {
  reportData: TOldVehicleReportData;
}) {
  const vehicleColorHex =
    getAllUniqueColors().find(
      (c) => c.color.toLowerCase() === reportData.vehicleColor.toLowerCase(),
    )?.hex ?? "#cccccc";

  const purchaseDateObj = new Date(reportData.purchaseDate);
  const purchasedOnStr = purchaseDateObj.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const createdAtStr = new Date(reportData.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <Document
      title={`NUMO AI Vehicle Energy Report - ${reportData.reportId}`}
      author="NUMO AI"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>NUMO AI</Text>
        <Text style={styles.title}>Complete Vehicle Energy Report</Text>
        <Text style={styles.metaLine}>Generated for: {reportData.userName}</Text>
        <Text style={styles.metaLine}>
          {createdAtStr} • Reference ID: {reportData.reportId}
        </Text>

        {/* Vehicle Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Vehicle Profile</Text>
          <View style={styles.statsRow} wrap={false}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>BIRTH #</Text>
              <Text style={styles.statValue}>{reportData.birthNumber}</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>DESTINY #</Text>
              <Text style={styles.statValue}>{reportData.destinyNumber}</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>VEHICLE #</Text>
              <Text style={styles.statValue}>
                {reportData.vehicleNumerologyNumber}
              </Text>
            </View>
          </View>
          <Text style={styles.profileTitle}>{reportData.vehicleProfileTitle}</Text>
          <Text style={styles.bodyText}>{reportData.vehicleProfileText}</Text>
        </View>

        {/* Vehicle Number Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Vehicle Number Analysis</Text>
          <View style={styles.plate} wrap={false}>
            <Text style={styles.plateReg}>{reportData.vehicleRegNumber}</Text>
            <Text style={styles.plateNum}>
              {"-> "}
              {reportData.vehicleNumerologyNumber}
            </Text>
          </View>
          <Text style={styles.matchBadge}>
            {reportData.vehicleAnalysisMatchType} MATCH
          </Text>
          <Text style={styles.scoreText}>
            {reportData.vehicleCompatibilityScore} / 100
          </Text>
          <Text style={styles.scoreLabel}>COMPATIBILITY SCORE</Text>
          <Text style={[styles.bodyText, { textAlign: "center", marginBottom: 8 }]}>
            {reportData.vehicleAnalysisDescription}
          </Text>
          <View style={styles.tagsRow}>
            {reportData.vehicleAnalysisTraits.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>

        {/* Color Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>
            Color Analysis — {reportData.vehicleColorMatchStatus}
          </Text>
          <View style={styles.colorRow} wrap={false}>
            <View style={[styles.swatch, { backgroundColor: vehicleColorHex }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileTitle}>{reportData.vehicleColor}</Text>
              <Text style={[styles.bodyText, { marginBottom: 4 }]}>
                {reportData.vehicleColorMatchPercentage}% Match
              </Text>
              <Text style={styles.bodyText}>{reportData.vehicleColorMatchReason}</Text>
            </View>
          </View>
        </View>

        {/* Purchase Date Energy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Purchase Date Energy</Text>
          <View style={styles.noteBox} wrap={false}>
            <Text style={[styles.bodyText, { marginBottom: 4 }]}>
              Purchased on: {purchasedOnStr}
            </Text>
            <Text style={styles.bodyText}>
              Day Energy: {reportData.purchaseDayEnergy} • Full Date Number:{" "}
              {reportData.purchaseDateNumerologyNumber}
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.profileTitle}>{reportData.purchaseDateTitle}</Text>
            <Text style={styles.bodyText}>{reportData.purchaseDateDescription}</Text>
          </View>
        </View>

        {/* Hidden Conflict Detection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Hidden Conflict Detection</Text>
          {reportData.conflicts.length > 0 ? (
            reportData.conflicts.map((text, i) => (
              <View key={i} style={styles.bulletRow} wrap={false}>
                <View style={styles.bulletDot} />
                <Text style={styles.bodyText}>{text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.bodyText}>
              No hidden conflicts detected — your vehicle number, purchase date,
              and color choice are free of numerology friction.
            </Text>
          )}
        </View>

        {/* Recommended Remedies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Recommended Remedies</Text>
          {reportData.remedies.length > 0 ? (
            reportData.remedies.map((item, i) => (
              <View key={i} style={styles.bulletRow} wrap={false}>
                <View style={styles.bulletDot} />
                <Text style={styles.bodyText}>{item.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.bodyText}>
              No remedies needed — your numbers are already in balance.
            </Text>
          )}
        </View>

        {/* Overall Vehicle Harmony Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Overall Vehicle Harmony Score</Text>
          <Text style={styles.scoreText}>{reportData.vehicleHarmonyScore}%</Text>
          <Text style={styles.scoreLabel}>
            {reportData.vehicleHarmonyStatus.toUpperCase()}
          </Text>
          {(
            [
              ["Number", reportData.vehicleHarmonyBreakdown.number],
              ["Color", reportData.vehicleHarmonyBreakdown.color],
              ["Timing", reportData.vehicleHarmonyBreakdown.timing],
              ["Stability", reportData.vehicleHarmonyBreakdown.stability],
            ] as const
          ).map(([label, value]) => (
            <View key={label} style={styles.breakdownRow}>
              <Text style={styles.bodyText}>{label}</Text>
              <Text style={styles.bodyText}>{value}%</Text>
            </View>
          ))}
        </View>

        {/* AI Deep Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>AI Deep Analysis</Text>
          {reportData.aiAnalysis ? (
            reportData.aiAnalysis
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((paragraph, i) => (
                <Text key={i} style={[styles.bodyText, { marginBottom: 6 }]}>
                  {paragraph}
                </Text>
              ))
          ) : (
            <Text style={styles.bodyText}>
              AI insights were still generating when this PDF was created — open
              the report in NUMO AI to view the full analysis.
            </Text>
          )}
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `NUMO AI • Vehicle Energy Report • Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
