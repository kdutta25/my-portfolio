import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LANGUAGES, getLanguage, resolveLanguage, type LanguageCode } from "../../i18n/languages";
import { switchLanguage } from "../../siteContent/ensureFragments";

const Wrap = styled.div`
  position: relative;
`;

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;

  &[aria-busy="true"] {
    cursor: progress;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

const Caret = styled.svg<{ $open: boolean }>`
  width: 0.7rem;
  height: 0.7rem;
  flex-shrink: 0;
  transition: transform 0.15s ease;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
`;

const List = styled.ul`
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  z-index: 1100;
  min-width: 10rem;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (min-width: 1200px) {
    left: auto;
    right: 0;
  }

  &:focus {
    outline: none;
  }
`;

const Option = styled.li<{ $active: boolean; $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.9rem;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.onInk : theme.colors.text)};
  background: ${({ theme, $active }) => ($active ? theme.colors.ink : "transparent")};
`;

const Check = styled.span`
  font-size: 0.8rem;
`;

export function LanguageMenu() {
  const { i18n, t } = useTranslation();
  const current = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const label = t("nav.toggleLanguage");

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(LANGUAGES.findIndex((l) => l.code === current));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const choose = (code: LanguageCode) => {
    close();
    if (code === current) return;
    setBusy(true);
    switchLanguage(code)
      .catch((err: unknown) => console.error("[LanguageMenu] failed to switch", code, err))
      .finally(() => setBusy(false));
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = LANGUAGES.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(LANGUAGES[activeIndex].code);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <Wrap ref={wrapRef} data-component-id="LanguageMenu">
      <Trigger
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${getLanguage(current).label}`}
        aria-busy={busy}
        title={label}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        <span lang={current}>{getLanguage(current).label}</span>
        <Caret aria-hidden viewBox="0 0 12 12" $open={open}>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </Caret>
      </Trigger>
      {open ? (
        <List
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`${listId}-${LANGUAGES[activeIndex].code}`}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {LANGUAGES.map((l, i) => (
            <Option
              key={l.code}
              id={`${listId}-${l.code}`}
              role="option"
              lang={l.code}
              aria-selected={l.code === current}
              $active={i === activeIndex}
              $selected={l.code === current}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(l.code)}
            >
              {l.label}
              {l.code === current ? <Check aria-hidden>✓</Check> : null}
            </Option>
          ))}
        </List>
      ) : null}
    </Wrap>
  );
}
