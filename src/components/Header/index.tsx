import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  hasBack?: boolean;
}

export default function Header({ hasBack = false }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-3">
      {hasBack && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <BsArrowLeft className="font-bold text-lg" />
        </button>
      )}
    </div>
  );
}
