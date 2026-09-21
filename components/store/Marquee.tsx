export function Marquee({
  items,
  inverted = false,
}: {
  items: string[];
  inverted?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`overflow-hidden ${
        inverted
          ? "bg-ink text-paper"
          : "border-y border-ink/10 bg-paper text-ink"
      }`}
    >
      <div className="marquee-track flex w-max">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center whitespace-nowrap px-7 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.32em]"
          >
            <span
              className={`mr-7 h-1 w-1 rounded-full ${
                inverted ? "bg-paper/40" : "bg-rust"
              }`}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
