export const runtime = 'nodejs';

import Link from 'next/link';
import { getSessionUser } from '@/lib/session';
import { getIndex, getLevel } from '@/lib/levels';
import { getUserProgressSummary } from '@/lib/progress';

export const metadata = {
  title: 'Anubis | Analog Horror Puzzle ARG',
  description: 'Explore damaged signals and solve sequential browser puzzles in Anubis, an analog horror alternate reality game. Create an account to begin.',
  alternates: { canonical: 'https://anubis.elfeel.me/' },
};

const featureSignals = [
  {
    title: 'Signal fragments',
    body: 'Every level is a damaged page, label, manifest, transcript, or recording. The answer is in how the evidence behaves.',
  },
  {
    title: 'Locked sequence',
    body: 'Progression follows the transmission order. Clear the current file before the next breach opens.',
  },
  {
    title: 'Quiet record',
    body: 'The scoreboard is only a record of clears. The site keeps the route out of view.',
  },
];

export default async function Page() {
  const user = await getSessionUser();
  const index = await getIndex();
  const progress = user ? await getUserProgressSummary(user.id, index) : null;

  let nextSlug: string | null = null;
  let nextTitle: string | null = null;
  if (progress?.nextSlug) {
    nextSlug = progress.nextSlug;
    nextTitle = progress.nextTitle ?? (await getLevel(progress.nextSlug)).title;
  }

  return (
    <div className="home-grid">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <h1 data-echo="Anubis">Anubis</h1>
          <p>
            An analog horror ARG built from damaged signals, missing frames, bad captions, and evidence that refuses to
            explain itself.
          </p>
          {!user ? (
            <div className="hero-actions">
              <Link href="/signup" className="btn primary" data-echo="Create account">
                Create account
              </Link>
              <Link href="/login" className="btn" data-echo="Log in">
                Log in
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              {nextSlug && (
                <Link className="btn accent" href={`/level/${nextSlug}`} data-echo="Continue">
                  Resume {nextTitle}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="panel intel-panel">
        <h2 data-echo="Viewing notes">Viewing notes</h2>
        <div className="intel-cards">
          {featureSignals.map(({ title, body }) => (
            <article key={title} className="intel-card">
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="intel-note">
          <small>
            Not every clue is visible at first glance. Titles, source, attachments, rhythm, wording, and layout can all
            matter.
          </small>
        </p>
      </section>

      <section className="panel feed-panel">
        <h2 data-echo="Transmission status">Transmission status</h2>
        <div className="feed-grid">
          <div className="feed-callout">
            <h3>Clear log</h3>
            <p>
              The leaderboard tracks cleared files without exposing the route. Sort the record, then get back to the
              signal.
            </p>
            <Link className="btn" href="/leaderboard" data-echo="Leaderboard">
              Check the leaderboard
            </Link>
          </div>
          <div className="feed-callout">
            <h3>File shelf</h3>
            <p>
              Revisit unlocked files as evidence, not tutorials. The objects stay visible; the deductions stay yours.
            </p>
            <Link className="btn" href="/levels" data-echo="Unlocked files">
              Revisit your clears
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
