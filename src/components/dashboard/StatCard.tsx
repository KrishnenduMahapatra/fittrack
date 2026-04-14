import Card from '../common/Card';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  color?: string;
  onClick?: () => void;
}

export default function StatCard({ label, value, subValue, color = 'text-white', onClick }: StatCardProps) {
  return (
    <Card onClick={onClick} className="text-center">
      <p className="text-muted text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {subValue && <p className="text-xs text-muted mt-1">{subValue}</p>}
    </Card>
  );
}