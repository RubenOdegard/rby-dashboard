import { useStore } from "../stores/store";

interface ContextProviderProps {
  children: React.ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  useStore();
  return <>{children}</>;
};
