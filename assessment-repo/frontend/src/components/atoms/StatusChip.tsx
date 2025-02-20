export type StatusType = "healthy" | "warning" | "error";

export interface StatusChipProps {
  status: StatusType;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  const chipColor = {
    healthy: "border-green-500 bg-green-500 text-green-500",
    warning: "border-yellow-500 bg-yellow-500 text-yellow-500",
    error: "border-red-500 bg-red-500 text-red-500",
  };

  return (
    <div
      className={`${chipColor[status]} uppercase flex items-center justify-center w-[75px] p-1 border-2 bg-opacity-10 font-bold rounded-full text-[10px]`}
    >
      {status}
    </div>
  );
};
