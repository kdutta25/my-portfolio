import React, { useMemo } from "react";
import Typewriter from "typewriter-effect";
import { useTranslation } from "react-i18next";

function Type() {
  const { t } = useTranslation();
  const strings = useMemo(() => {
    const raw = t("typewriter.roles", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);

  if (strings.length === 0) {
    return null;
  }

  return (
    <Typewriter
      options={{
        strings,
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
