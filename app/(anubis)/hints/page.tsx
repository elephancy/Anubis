export const revalidate = 300;

export const metadata = {
  title: 'Spoiler-Free Puzzle Hints | Anubis ARG',
  description: 'Tips for inspecting source, console messages, network requests and visual clues in the Anubis analog horror puzzle ARG.',
  alternates: { canonical: 'https://anubis.elfeel.me/hints' },
};

export default function Page() {
  return (
    <section className="panel">
      <h1 data-echo="Hints">Hints</h1>
      <ul>
        <li>View source. Search for HTML comments.</li>
        <li>Open console. Read messages.</li>
        <li>
          Change <code>{'<img id="p" src="...">'}</code> to hidden variants.
        </li>
        <li>Check network, robots, and CSS print rules.</li>
      </ul>
      <p><small>No spoilers. All hints are in-level.</small></p>
    </section>
  );
}

