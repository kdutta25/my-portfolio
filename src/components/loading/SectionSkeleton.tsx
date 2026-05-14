import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  50% { opacity: 0.45; }
`;

const Bar = styled.div<{ $w: string }>`
  height: 0.85rem;
  width: ${({ $w }) => $w};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.border};
  animation: ${pulse} 1.1s ease-in-out infinite;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.25rem 0;
`;

export function SectionSkeleton() {
  return (
    <Stack data-component-id="SectionSkeleton" aria-hidden>
      <Bar $w="38%" />
      <Bar $w="72%" />
      <Bar $w="88%" />
      <Bar $w="64%" />
    </Stack>
  );
}
