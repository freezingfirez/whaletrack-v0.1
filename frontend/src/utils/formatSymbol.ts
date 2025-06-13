export function formatSymbol(pair: string): string {
  let base: string, quote: string;

  if (pair.includes("/")) {
    [base, quote] = pair.split("/");
  } else if (pair.toUpperCase().endsWith("USDT")) {
    base  = pair.slice(0, -4);
    quote = "USDT";
  } else if (pair.toUpperCase().endsWith("USD")) {
    base  = pair.slice(0, -3);
    quote = "USD";
  } else {
    base  = pair;
    quote = "";
  }

  const mappedQuote = quote.toUpperCase() === "USD" ? "USDT" : quote.toUpperCase();

  return mappedQuote
    ? `BINANCE:${base.toUpperCase()}${mappedQuote}`
    : `BINANCE:${base.toUpperCase()}`;
}
