import { useState } from "react";

import { Check, Copy } from "lucide-react";

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
    <div className="my-4 overflow-hidden rounded-xl border">

      <div className="flex items-center justify-between border-b bg-muted px-4 py-2">

        <span className="text-sm font-medium capitalize text-muted-foreground">
          {language}
        </span>

        <button
          onClick={copyCode}
          className="flex items-center gap-2 rounded-md px-2 py-1 text-sm transition hover:bg-background"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>

      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: "20px",
        }}
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
}