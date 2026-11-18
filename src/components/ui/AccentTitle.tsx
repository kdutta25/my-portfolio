import styled from "styled-components";

const Lead = styled.span`
  text-transform: uppercase;
`;

const Accent = styled.em`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
  text-transform: lowercase;
  font-size: 1.12em;
  color: ${({ theme }) => theme.colors.text};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-family: ${({ theme }) => theme.fonts.serif};
`;

export function splitAccent(text: string): { lead: string; accent: string } {
  const match = /^([\s\S]*?)(\S+)\s*$/.exec(text);
  if (!match) return { lead: "", accent: text };
  return { lead: match[1], accent: match[2] };
}

/** Bold sans lead words with the last word set in serif italic, as in the reel headings. */
export function AccentTitle({ text, dot = true }: { text: string; dot?: boolean }) {
  const { lead, accent } = splitAccent(text);
  const endsWithPunctuation = /[.!?]$/.test(accent);
  return (
    <>
      {lead ? <Lead>{lead}</Lead> : null}
      <Accent data-component-id="AccentWord">{accent}</Accent>
      {dot && !endsWithPunctuation ? <Dot aria-hidden>.</Dot> : null}
    </>
  );
}
