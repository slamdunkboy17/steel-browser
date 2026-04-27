import SessionConsole from "@/components/sessions/session-console";
import { SessionViewer } from "@/components/sessions/session-viewer";
import { Button } from "@/components/ui/button";
import { useSessionsContext } from "@/hooks/use-sessions-context";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useParams } from "react-router-dom";

// YG3 fork: when ?embed=true, default the console hidden and strip
// padding/borders so the Chromium viewer fills the entire iframe.
function isEmbed(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("embed") === "true" || params.get("embed") === "1";
}

// YG3 fork: when there's no router param (embed mode loads the root URL),
// fall back to ?session_id=<uuid> so callers can target a specific session.
// Without this, Steel's useSession(undefined!) hook returns sessions[0]
// which on a busy server is whoever happened to be created most recently
// — not the session we provisioned for this onboarding.
function getEmbedSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get("session_id") ?? undefined;
}

export function SessionContainer() {
  const params = useParams();
  const embed = isEmbed();
  const id = params.id ?? getEmbedSessionId();

  const { useSession } = useSessionsContext();
  const { data: session, isLoading, isError } = useSession(id!);
  const [showConsole, setShowConsole] = useState(!embed);
  if (isLoading) return <div>Loading...</div>;
  if (isError || !session) return <div>Error</div>;

  if (embed) {
    return (
      <div className="flex flex-col overflow-hidden items-center justify-center h-full w-full bg-[var(--gray-2)]">
        <SessionViewer id={id!} />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden items-center justify-center h-full w-full p-4">
      <div className="flex flex-col overflow-hidden items-center justify-center h-full w-full rounded-md bg-[var(--gray-2)] p-4 pt-2 gap-3">
        <div className="flex items-center overflow-hidden justify-center h-full w-full gap-3">
          <div
            className={`flex flex-col items-center justify-center h-full flex-1 border border-[var(--gray-6)] relative rounded-md ${
              showConsole ? "w-2/3" : "w-full"
            }`}
          >
            <Button
              variant="secondary"
              onClick={() => setShowConsole(!showConsole)}
              className="text-primary bg-[var(--gray-3)] ml-auto px-3 rounded-lg absolute top-2 right-2"
            >
              {showConsole ? (
                <ArrowRightIcon className="w-4 h-4" />
              ) : (
                <ArrowLeftIcon className="w-4 h-4" />
              )}
            </Button>
            <SessionViewer id={id!} />
          </div>
          {showConsole && (
            <div className="flex flex-col items-center overflow-hidden w-1/3 justify-center h-full text-primary gap-2">
              <div className="flex flex-col items-center overflow-hidden justify-center w-full h-full border border-[var(--gray-6)] rounded-md overflow-hidden">
                {session && <SessionConsole id={id!} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
