
export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-navy sm:text-4xl">
            Terms of Use
          </h1>
          <p className="mt-2 text-sm text-slate-blue-400">Last updated: July 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-blue sm:text-base">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink-navy">What SchemeFind is</h2>
              <p className="mt-2">
                SchemeFind is an independent eligibility discovery platform. It helps you find government welfare schemes 
                you may qualify for based on the information you provide. It is <strong>not</strong> an official 
                government service, and it does not guarantee that you will receive benefits from any scheme.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-navy">Not legal or financial advice</h2>
              <p className="mt-2">
                The eligibility information provided by SchemeFind is for informational purposes only. It is based 
                on publicly available scheme rules and may not reflect the most current eligibility criteria. 
                Always verify your eligibility with the relevant government authority before applying.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-navy">Your responsibility</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Provide accurate information in your profile</li>
                <li>Verify eligibility with the relevant government authority before applying</li>
                <li>Review and confirm OCR-extracted document data before saving</li>
                <li>Keep your account credentials secure</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-navy">No warranty</h2>
              <p className="mt-2">
                SchemeFind is provided &ldquo;as is&rdquo; without warranty of any kind, express or implied. 
                The project maintainers make no guarantees about the accuracy, completeness, or timeliness of 
                scheme information or eligibility results.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-navy">Limitation of liability</h2>
              <p className="mt-2">
                The project maintainers and contributors are not liable for any damages arising from your use of 
                SchemeFind, including but not limited to: denied benefits, missed application deadlines, or 
                incorrect eligibility assessments.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-navy">Platform usage & intellectual property</h2>
              <p className="mt-2">
                SchemeFind, its interface, algorithms, trademarks, and design are protected by applicable intellectual property laws. You may use SchemeFind for personal, non-commercial eligibility discovery.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-navy">Changes to these terms</h2>
              <p className="mt-2">
                We may update these terms as the platform evolves. Changes will be posted here with an updated date. 
                Continued use of the service after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="rounded-lg border border-caution-amber/20 bg-caution-amber/5 px-5 py-4">
              <p className="text-sm leading-relaxed text-slate-blue">
                <strong className="text-caution-amber">Remember:</strong> SchemeFind is an independent 
                platform — not an official government service. We do not represent any government 
                authority. Always verify eligibility and application status with the relevant department.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
