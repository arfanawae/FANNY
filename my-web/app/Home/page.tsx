import Card from "@/components/Card";

export default function ThreeBoxes() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 p-6">
      <Card title="a 1" body="b 1" />
      <Card title="a 2" body="b 2" />
      <Card title="a 3" body="b 3" />
    </div>
  );
}