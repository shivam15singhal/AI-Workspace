from ddgs import DDGS


class WebSearchTool:
    name = "web_search"

    description = (
        "Search the internet for recent or factual information. "
        "Arguments: query (string), max_results (optional integer)."
    )

    def execute(
        self,
        query: str,
        max_results: int = 5,
    ):
        try:
            with DDGS() as ddgs:
                results = list(
                    ddgs.text(
                        query=query,
                        max_results=max_results,
                    )
                )

            if not results:
                return {
                    "results": [],
                }

            return {
                "results": [
                    {
                        "title": item.get("title"),
                        "url": item.get("href"),
                        "snippet": item.get("body"),
                    }
                    for item in results
                ]
            }

        except Exception as e:
            return {
                "error": str(e),
            }