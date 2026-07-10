"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@lib/utils";
import { Input } from "@components/ui/Input";
import { Button } from "@components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@components/ui/Dialog";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      reset?: (widgetId: string) => void;
    };
  }
}

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact" | "card";
  layout?: "inline" | "button";
}

const API_URL = import.meta.env.PUBLIC_API_URL ?? "";
const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function NewsletterSignup({
  title = "Subscribe to our newsletter",
  description = "Get the latest nuclear engineering news, tutorials, and updates delivered to your inbox.",
  className,
  variant = "default",
  layout = "inline",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (TURNSTILE_SITE_KEY === "") return;

    if (document.getElementById("turnstile-script")) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.id = "turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.body.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(widgetIdRef.current);
      }
    };
  }, []);

  const renderWidget = () => {
    if (
      !turnstileRef.current ||
      !window.turnstile ||
      TURNSTILE_SITE_KEY === ""
    ) {
      return;
    }
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "auto",
    });
  };

  const getTurnstileToken = (): string | null => {
    const input = document.querySelector<HTMLInputElement>(
      "[name=cf-turnstile-response]",
    );
    return input?.value ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const trimmed = email.trim();
    if (trimmed === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (API_URL === "") {
      setStatus("error");
      setMessage("Newsletter signup is not configured.");
      return;
    }

    const turnstileToken = getTurnstileToken();
    if (TURNSTILE_SITE_KEY !== "" && turnstileToken === null) {
      setStatus("error");
      setMessage("Please complete the CAPTCHA verification.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        errors?: Record<string, string>;
      };

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message ?? "Thanks for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(
          data.errors?.email ??
            data.message ??
            "Something went wrong. Please try again.",
        );
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  const isCompact = variant === "compact";
  const isCard = variant === "card";

  const header = (title || description) && (
    <div>
      {title && (
        <h3
          className={cn(
            "font-semibold tracking-tight",
            isCompact ? "text-sm" : "text-base",
          )}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          className={cn(
            "mt-0.5 text-muted-foreground",
            isCompact ? "text-xs" : "text-sm",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );

  const form = (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-row items-start gap-2"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className={cn("pl-9", isCompact && "h-8 text-sm")}
          />
        </div>
        {TURNSTILE_SITE_KEY !== "" && (
          <div ref={turnstileRef} className="cf-turnstile" />
        )}
      </div>
      <Button
        type="submit"
        loading={status === "loading"}
        disabled={status === "success"}
        size={isCompact ? "sm" : "default"}
        className="shrink-0"
      >
        {status === "success" ? "Subscribed" : "Subscribe"}
      </Button>
    </form>
  );

  const feedback = status !== "idle" && status !== "loading" && (
    <div
      className={cn(
        "mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        status === "success"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
          : "border-red-500/20 bg-red-500/10 text-red-900 dark:text-red-100",
      )}
      role="status"
      aria-live="polite"
    >
      {status === "success" ? (
        <CheckCircle size={16} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );

  if (layout === "button") {
    return (
      <div className={className}>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          size={isCompact ? "sm" : "default"}
        >
          {title || "Subscribe"}
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {title || "Subscribe to our newsletter"}
              </DialogTitle>
              <DialogDescription>
                {description ||
                  "Get the latest updates delivered to your inbox."}
              </DialogDescription>
            </DialogHeader>
            <DialogClose />
            <div className="px-6 pb-6">
              {form}
              {feedback}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative",
        isCard &&
          "rounded-2xl border border-border/50 bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        {header}
        {form}
      </div>
      {feedback}
    </div>
  );
}
