// src/components/admin/Barcode.tsx
interface BarcodeProps {
  value: string;
}

const Barcode: React.FC<BarcodeProps> = ({ value }) => {
  return (
    <div className="barcode-wrapper">
      {/* Cách đơn giản: dùng ảnh mẫu */}
      <img
        src="/assets/img/barcode-demo.png"
        alt={`Mã vạch ${value}`}
        className="barcode-img"
      />
      <div className="barcode-value">{value}</div>
    </div>
  );
};

export default Barcode;
