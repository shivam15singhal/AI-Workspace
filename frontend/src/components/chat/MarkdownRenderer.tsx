import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

type Props = {
  content: string;
};

export default function MarkdownRenderer({
  content,
}: Props) {
  return (
    <div
      className="
      prose
      prose-neutral
      max-w-none
      dark:prose-invert

      prose-headings:font-semibold
      prose-headings:tracking-tight

      prose-p:leading-7

      prose-pre:p-0
      prose-pre:bg-transparent

      prose-code:before:hidden
      prose-code:after:hidden
    "
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { className, children } = props;

          const match = /language-(\w+)/.exec(
            className || "",
          );

          if (match) {
            return (
              <CodeBlock
        language={match[1]}
        code={String(children).replace(/\n$/, "")}
      />
    );
          }

          return (
            <code
              className="rounded bg-muted px-1 py-0.5"
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
     </div>
  );
}