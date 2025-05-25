interface MessageProps {
  name: string;
  message: string;
  sentAt: string;
  isMine?: boolean;
}

export default function Message({
  name,
  message,
  sentAt,
  isMine,
}: MessageProps) {
  return (
    <div className={`${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1 justify-center`}>
      <div className="font-bold ml-1">{name}</div>
      <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end w-full`}>
        <div className={`${isMine ? 'bg-blue-200' : 'bg-gray-300'} py-2 px-3 rounded-md max-w-1/2`}>{message}</div>
        <div className="text-sm">{new Date(sentAt).toLocaleTimeString()}</div>
      </div>
    </div>
  )
}
