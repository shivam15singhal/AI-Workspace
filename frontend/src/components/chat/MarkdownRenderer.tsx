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
dark:prose-invert
max-w-none

prose-headings:mb-4
prose-headings:mt-10
prose-headings:first:mt-0
prose-headings:font-semibold
prose-headings:tracking-tight

prose-p:leading-7
prose-p:my-5

prose-ul:my-6
prose-ol:my-6
prose-li:my-2
prose-li:leading-7

prose-blockquote:border-l-4
prose-blockquote:border-primary
prose-blockquote:pl-4
prose-blockquote:italic

prose-table:border
prose-table:border-border

prose-th:border
prose-th:border-border
prose-th:bg-muted
prose-th:px-4
prose-th:py-2

prose-td:border
prose-td:border-border
prose-td:px-4
prose-td:py-2

prose-hr:border-border
prose-hr:my-10

prose-img:rounded-2xl
prose-img:shadow-lg
prose-img:border

prose-a:text-primary
prose-a:no-underline
hover:prose-a:underline

prose-pre:bg-transparent
prose-pre:p-0

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
              className="
rounded-md
bg-muted
border
border-border/60
px-1.5
py-0.5
font-mono
text-[0.9em]
text-blue-500
font-medium
underline-offset-4
hover:underline
"
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