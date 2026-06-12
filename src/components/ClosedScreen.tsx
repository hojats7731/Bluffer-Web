interface Props {
  reason: string;
  onReset: () => void;
}

export function ClosedScreen({ reason, onReset }: Props) {
  return (
    <div className="screen">
      <h1>اتاق بسته شد</h1>
      <p className="subtitle">{reason}</p>
      <button type="button" onClick={onReset}>
        بازگشت
      </button>
    </div>
  );
}
