import { notFound } from "next/navigation";
import { CognizantLogo } from "@/components/CognizantLogo";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { ReportView } from "@/components/ReportView";
import { getBand, getOverallScore } from "@/lib/scoring";
import { kvConfigured, loadReport } from "@/lib/reports";

export const dynamic = "force-dynamic";

export default async function SavedReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!kvConfigured()) {
    return (
      <>
        <ProgressBar value={1} max={1} />
        <header className="cog-chrome px-6 sm:px-10 pt-6">
          <CognizantLogo size={28} />
        </header>
        <main className="flex-1 px-6 sm:px-10 py-16 max-w-3xl w-full mx-auto">
          <h1 className="text-white font-light text-[28px] mb-4">
            Saved reports aren&rsquo;t configured yet
          </h1>
          <p className="text-white/70 text-[15px] leading-relaxed font-light">
            Connect a KV / Upstash store on Vercel
            (<span className="font-mono text-white/85">Storage → Create → KV</span>),
            then redeploy. New assessments will be shareable via{" "}
            <span className="font-mono text-white/85">/r/&lt;id&gt;</span> links.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const report = await loadReport(id);
  if (!report) notFound();

  const overallBand = getBand(getOverallScore(report.answers));

  return (
    <>
      <ProgressBar value={1} max={1} />

      <ReportView
        answers={report.answers}
        clientName={report.clientName}
        industry={report.industry}
        context={report.context}
        preloadedAnalysis={report.analysis}
        reportLabel="Shared Report"
      />

      <Footer status={`Overall · ${overallBand}`} />
    </>
  );
}
