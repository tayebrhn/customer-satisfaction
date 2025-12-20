import { motion } from "framer-motion";

type StatusType = "loading" | "error" | "empty" | "info";

interface StatusMessageProps {
  type: StatusType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  imageSrc,
}) => {
  const colorMap: Record<StatusType, string> = {
    loading: "text-gray-600",
    error: "text-red-600",
    empty: "text-gray-700",
    info: "text-blue-600",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brandGreen-200 px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="">
          {imageSrc && (
            <img src={imageSrc} alt={type} className="w-40 mb-4 opacity-90" />
          )}

          <h2 className={`text-lg font-semibold ${colorMap[type]}`}>{title}</h2>

          {description && (
            <p className="text-sm text-gray-500 mt-2 max-w-md">{description}</p>
          )}

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-4 px-4 py-2 rounded-md bg-brandGreen-600 text-white hover:bg-brandGreen-700 transition"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
