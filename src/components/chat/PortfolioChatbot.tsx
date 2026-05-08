import { useCallback, useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { findKnowledgeAnswer } from "../../chat/matchKnowledge";
import { README_ON_GITHUB_URL } from "../../constants/externalLinks";

type Msg = { role: "user" | "bot"; text: string };

const NAV_KEYS = [
  "about",
  "experience",
  "skills",
  "projects",
  "education",
  "volunteering",
  "publications",
  "github",
  "readme",
  "support",
] as const;

const Wrap = styled.div`
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.65rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  overflow-x: visible;
  font-family: ${({ theme }) => theme.fonts.sans};
`;

const ToggleBtn = styled.button`
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  font-size: 1.35rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Panel = styled.div`
  width: min(360px, calc(100vw - 2rem));
  max-height: min(520px, 70vh);
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const PanelHead = styled.div`
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MsgArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Bubble = styled.div<{ $role: Msg["role"] }>`
  align-self: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
  max-width: 92%;
  padding: 0.55rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  background: ${({ theme, $role }) =>
    $role === "user" ? theme.colors.accentSoft : theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid
    ${({ theme, $role }) =>
      $role === "user" ? theme.colors.accent : theme.colors.border};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0 1rem 0.65rem;
`;

const Chip = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Form = styled.form`
  display: flex;
  gap: 0.45rem;
  padding: 0.65rem 1rem 0.85rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.45rem 0.55rem;
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SendBtn = styled.button`
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) =>
    theme.mode === "dark" ? theme.colors.bg : "#fffefb"};
  font-size: 0.8rem;
  font-weight: 650;
  padding: 0.45rem 0.75rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function botReplyFromText(raw: string, t: TFunction): { text: string; scroll?: string } {
  const q = raw.trim().toLowerCase();
  if (!q) return { text: t("chatbot.emptyPrompt") };

  const kb = findKnowledgeAnswer(raw);
  if (kb) {
    if (/\blinkedin\b/i.test(raw)) {
      return {
        text: `${kb}\n\n${t("chatbot.linkedinOpenProfile", { url: t("footer.linkedin") })}`,
      };
    }
    return { text: kb };
  }

  const scrollAbout =
    /\babout me\b|\babout yourself\b|who are you|your bio|your background|introduce yourself|^bio\b|^intro\b|tell me about yourself|present yourself/.test(
      q,
    );
  if (scrollAbout)
    return {
      text: t("chatbot.aboutAnswer"),
      scroll: "#about",
    };

  if (/\blinkedin\b|linkedin profile\b/.test(q))
    return {
      text: t("chatbot.linkedinAnswer", { url: t("footer.linkedin") }),
    };

  if (/\bhelp\b|^hi$|^hello\b|^hey\b/.test(q))
    return {
      text: `${t("chatbot.fallback")}\n\n${t("chatbot.trySections")}`,
    };

  const sectionMatchers: { test: RegExp; hash: string; key: string }[] = [
    { test: /\bexperience\b|work\b|job\b|career\b|nokia\b/, hash: "#experience", key: "chatbot.snippetExperience" },
    { test: /\bskill\b|stack\b|tech\b|tool\b/, hash: "#skills", key: "chatbot.snippetSkills" },
    { test: /\bcomposer\b|claude opus|gpt codex|gpt\s*5|codex\b|ai models\b/, hash: "#skills", key: "chatbot.snippetAiModels" },
    { test: /\bproject\b/, hash: "#projects", key: "chatbot.snippetProjects" },
    { test: /\beducation\b|degree\b|university\b|school\b|kiit\b|ottawa\b|xavier\b/, hash: "#education", key: "chatbot.snippetEducation" },
    { test: /\bvolunteer\b/, hash: "#volunteering", key: "chatbot.snippetVolunteering" },
    { test: /\bpublication\b|paper\b|ieee\b/, hash: "#publications", key: "chatbot.snippetPublications" },
    { test: /\bcoffee\b|support\b|donat/, hash: "#support", key: "chatbot.snippetSupport" },
    { test: /\bgithub\b|commit\b/, hash: "#github", key: "chatbot.snippetGitHub" },
  ];

  for (const m of sectionMatchers) {
    if (m.test.test(q)) {
      return {
        text: `${t(m.key)}\n\n${t("chatbot.navigatedHint")}`,
        scroll: m.hash,
      };
    }
  }

  return {
    text: `${t("chatbot.fallback")}\n\n${t("chatbot.trySections")}`,
  };
}

export function PortfolioChatbot() {
  const { t } = useTranslation();
  const titleId = useId();
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const pushExchange = useCallback(
    (userText: string) => {
      const { text, scroll } = botReplyFromText(userText, t);
      setMessages((prev) => [
        ...prev,
        { role: "user", text: userText },
        { role: "bot", text },
      ]);
      if (scroll) {
        window.setTimeout(() => scrollToHash(scroll), 250);
      }
    },
    [t],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    setInput("");
    pushExchange(v);
  };

  const goNav = (key: (typeof NAV_KEYS)[number]) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: t(`chatbot.userAskSection`, { section: t(`nav.${key}`) }),
      },
      {
        role: "bot",
        text:
          key === "readme"
            ? t("chatbot.openedReadmeTab")
            : t("chatbot.navigatedTo", { section: t(`nav.${key}`) }),
      },
    ]);
    if (key === "readme") {
      window.open(README_ON_GITHUB_URL, "_blank", "noopener,noreferrer");
      return;
    }
    scrollToHash(`#${key}`);
  };

  return (
    <Wrap data-component-id="PortfolioChatbot" aria-label={t("chatbot.ariaLabel")}>
      {open ? (
        <Panel data-component-id="Panel" role="dialog" aria-labelledby={titleId}>
          <PanelHead data-component-id="PanelHead">
            <PanelTitle data-component-id="PanelTitle" id={titleId}>{t("chatbot.title")}</PanelTitle>
            <CloseBtn
              data-component-id="CloseBtn"
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("chatbot.close")}
            >
              ×
            </CloseBtn>
          </PanelHead>
          <ChipRow data-component-id="ChipRow">
            {NAV_KEYS.map((key) => (
              <Chip data-component-id="Chip" key={key} type="button" onClick={() => goNav(key)}>
                {t(`nav.${key}`)}
              </Chip>
            ))}
          </ChipRow>
          <MsgArea data-component-id="MsgArea" ref={areaRef}>
            {messages.map((m, i) => (
              <Bubble data-component-id="Bubble" key={`${i}-${m.role}`} $role={m.role}>
                {m.text}
              </Bubble>
            ))}
          </MsgArea>
          <Form data-component-id="Form" onSubmit={onSubmit}>
            <Input
              data-component-id="Input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              aria-label={t("chatbot.placeholder")}
              autoComplete="off"
            />
            <SendBtn data-component-id="SendBtn" type="submit" disabled={!input.trim()}>
              {t("chatbot.send")}
            </SendBtn>
          </Form>
        </Panel>
      ) : null}
      <ToggleBtn
        data-component-id="ToggleBtn"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        title={open ? t("chatbot.close") : t("chatbot.open")}
      >
        {open ? "×" : "💬"}
      </ToggleBtn>
    </Wrap>
  );
}
