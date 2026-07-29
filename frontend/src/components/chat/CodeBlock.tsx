import { useState } from "react";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  language: string;
  code: string;
};

export default function CodeBlock({
  language,
  code,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">

      <div
  className="
    flex
    items-center
    justify-between
    border-b
    border-border/60
    bg-muted/70
backdrop-blur
    px-4
    py-3
  "
>

        <span
  className="
    rounded-md
    bg-background
    px-2
    py-1
    text-xs
    font-medium
    uppercase
    tracking-wide
    text-muted-foreground
  "
>
          {language}
        </span>

        <Button variant="ghost" size="sm" onClick={copyCode} className="gap-2 rounded-lg">
          {copied ? (
  <>
    <Check className="h-4 w-4 text-green-500" />
    Copied
  </>
) : (
  <>
    <Copy className="h-4 w-4" />
    Copy
  </>
)}
        </Button>

      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: "24px",
        }}
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
}