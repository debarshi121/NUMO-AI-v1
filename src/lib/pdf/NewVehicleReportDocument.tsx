import { Document, Page, View, Text, Link, Svg, Path, StyleSheet } from "@react-pdf/renderer";
import type { TNewVehicleReportData } from "@/types/vehicleReport";
import { pdfColors } from "./theme";

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

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
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: pdfColors.border,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: pdfColors.border,
  },
  colorName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  colorMeta: {
    fontSize: 8,
    color: pdfColors.primary,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dateCard: {
    width: "31%",
    borderWidth: 1,
    borderColor: pdfColors.border,
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  dateBadge: {
    fontSize: 7,
    color: pdfColors.primary,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.ink,
  },
  dateYear: {
    fontSize: 8,
    color: pdfColors.inkMuted,
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: pdfColors.inkMuted,
    marginRight: 6,
    marginTop: 4,
  },
  noteBox: {
    backgroundColor: pdfColors.dangerSurface,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 9,
    color: pdfColors.danger,
    lineHeight: 1.4,
  },
  ctaBox: {
    borderWidth: 1,
    borderColor: pdfColors.primary,
    borderRadius: 8,
    padding: 14,
    backgroundColor: pdfColors.surface,
  },
  ctaHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  ctaIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: pdfColors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.ink,
    flex: 1,
  },
  ctaBody: {
    fontSize: 9.5,
    color: pdfColors.inkMuted,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  ctaFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  ctaFeatureText: {
    fontSize: 9,
    color: pdfColors.ink,
  },
  ctaButton: {
    marginTop: 8,
    backgroundColor: pdfColors.primary,
    borderRadius: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.onPrimary,
    textAlign: "center",
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

function PinIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
        fill={pdfColors.onPrimary}
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Path
        d="M20 6 9 17l-5-5"
        fill="none"
        stroke={pdfColors.primary}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function NewVehicleReportDocument({
  reportData,
  reportUrl,
}: {
  reportData: TNewVehicleReportData;
  reportUrl: string;
}) {
  const createdAtStr = new Date(reportData.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  const preferredMonth = reportData.buyingPreferenceMonth
    .toString()
    .padStart(2, "0")
    .slice(-2);
  const buyingMonthName = MONTH_NAMES[parseInt(preferredMonth, 10) - 1] || "-";

  return (
    <Document
      title={`NUMO AI Vehicle Guidance Report - ${reportData.reportId}`}
      author="NUMO AI"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>NUMO AI</Text>
        <Text style={styles.title}>Complete Vehicle Guidance Report</Text>
        <Text style={styles.metaLine}>Generated for: {reportData.userName}</Text>
        <Text style={styles.metaLine}>
          {createdAtStr} • Reference ID: {reportData.reportId}
        </Text>

        {/* Vehicle Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Your Vehicle Profile</Text>
          <View style={styles.statsRow} wrap={false}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>BIRTH</Text>
              <Text style={styles.statValue}>#{reportData.birthNumber}</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>DESTINY</Text>
              <Text style={styles.statValue}>#{reportData.destinyNumber}</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>MONTH</Text>
              <Text style={styles.statValue}>{buyingMonthName}</Text>
            </View>
          </View>
          <Text style={styles.profileTitle}>{reportData.vehicleProfileTitle}</Text>
          <Text style={styles.bodyText}>{reportData.vehicleProfileText}</Text>
        </View>

        {/* Lucky Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Lucky Vehicle Colors</Text>
          {reportData.recommendedColors.map((c, i) => (
            <View key={c.color} style={styles.colorRow} wrap={false}>
              <View style={[styles.swatch, { backgroundColor: c.hex }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.colorName}>
                  #{i + 1} {c.color}
                </Text>
                <Text style={styles.colorMeta}>
                  {c.category === "primary" ? "STRONG MATCH" : "BALANCED MATCH"}
                </Text>
                <Text style={styles.bodyText}>{c.reason}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Avoid Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Avoid Colors</Text>
          {reportData.avoidColors.map((item) => (
            <View key={item.color} style={styles.colorRow} wrap={false}>
              <View style={[styles.swatch, { backgroundColor: item.hex }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.colorName}>{item.color}</Text>
                <Text style={styles.bodyText}>{item.reason}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recommended Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Recommended Purchase Dates</Text>
          {reportData.recommendedDatesNote && (
            <View style={styles.noteBox} wrap={false}>
              <Text style={styles.noteText}>{reportData.recommendedDatesNote}</Text>
            </View>
          )}
          <View style={styles.datesGrid}>
            {reportData.recommendedDates.map((d, i) => (
              <View key={i} style={styles.dateCard} wrap={false}>
                {d.stars >= 4 && (
                  <Text style={styles.dateBadge}>
                    {d.stars === 5 ? "STRONG MATCH" : "GOOD MATCH"}
                  </Text>
                )}
                <Text style={styles.dateValue}>
                  {d.day} {d.month}
                </Text>
                <Text style={styles.dateYear}>{d.year}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Number Plate Compatibility CTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={140}>Number Plate Strategy</Text>
          <View style={styles.ctaBox} wrap={false}>
            <View style={styles.ctaHeaderRow}>
              <View style={styles.ctaIconBadge}>
                <PinIcon />
              </View>
              <Text style={styles.ctaTitle}>Check Your Number Plate Compatibility</Text>
            </View>
            <Text style={styles.ctaBody}>
              Your registration number carries its own numerology, and it can either
              amplify or clash with your Birth and Destiny numbers. Use the free
              Number Plate Compatibility Checker in your NUMO AI report to test any
              plate before you finalize your purchase.
            </Text>
            <View style={styles.ctaFeatureRow}>
              <CheckIcon />
              <Text style={styles.ctaFeatureText}>Instant compatibility score for any number</Text>
            </View>
            <View style={styles.ctaFeatureRow}>
              <CheckIcon />
              <Text style={styles.ctaFeatureText}>Personalized to your Birth &amp; Destiny numbers</Text>
            </View>
            <View style={styles.ctaFeatureRow}>
              <CheckIcon />
              <Text style={styles.ctaFeatureText}>Free, unlimited checks on your NUMO AI account</Text>
            </View>
            <Link src={reportUrl} style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Check Number Plate Compatibility &gt;</Text>
            </Link>
          </View>
        </View>

        {/* Avoid Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>Avoid Patterns</Text>
          {reportData.avoidPatterns.map((item) => (
            <View key={item} style={styles.bulletRow} wrap={false}>
              <View style={styles.bulletDot} />
              <Text style={styles.bodyText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* AI Deep Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={90}>AI Deep Analysis</Text>
          <Text style={styles.bodyText}>
            {reportData.aiAnalysis ??
              "AI insights were still generating when this PDF was created — open the report in NUMO AI to view the full analysis."}
          </Text>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `NUMO AI • Vehicle Guidance Report • Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
