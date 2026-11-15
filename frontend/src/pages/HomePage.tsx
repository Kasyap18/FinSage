
import { ArrowRight, Landmark, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const models = [
  {
    title: "Loan Default Detection",
    description:
      "Assess loan default risk using applicant, credit, loan, and payment information.",
    href: "/loan",
    icon: Landmark,
    action: "Start Assessment",
    eyebrow: "Loan Risk",
  },
  {
    title: "Fraud Detection",
    description:
      "Analyze a transaction using account, device, location, and payment activity.",
    href: "/fraud",
    icon: ShieldAlert,
    action: "Analyze Transaction",
    eyebrow: "Transaction Risk",
  },
] as const;

export function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="max-w-3xl">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
          Risk intelligence workspace
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Choose an assessment to begin.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Select a workflow below. You’ll be guided through the required
          information before the assessment is submitted for analysis.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {models.map((model) => {
          const Icon = model.icon;

          return (
            <Card
              key={model.href}
              className="group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardHeader className="p-6 pb-4 sm:p-7 sm:pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                    {model.eyebrow}
                  </span>
                </div>

                <h2 className="mt-7 text-xl font-semibold tracking-tight text-slate-950">
                  {model.title}
                </h2>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                  {model.description}
                </p>
              </CardHeader>

              <CardContent className="p-6 pt-3 sm:p-7 sm:pt-3">
                <Link
                  to={model.href}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  {model.action}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Choose a workflow to continue. No assessment is submitted from this
        page.
      </p>
    </section>
  );
}
