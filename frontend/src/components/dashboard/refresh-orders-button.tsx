"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Opcional, se tiver tooltip

export function RefreshOrdersButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [router]);

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      variant="outline"
      size="icon"
      className="h-10 w-10 border-app-border bg-transparent text-app-text/60 hover:bg-app-card hover:text-app-text transition-colors rounded-full"
      title="Atualizar pedidos agora"
    >
      <RefreshCw
        className={`w-4 h-4 ${isPending ? "animate-spin text-brand-primary" : ""}`}
      />
    </Button>
  );
}
