type Props = {
  data: {
    id: number;
    content: string;
  }[];
};
export function BrNovel({ data }: Props) {
  return (
    <div className="Novel">
      {data.map((item) => (
        <>
          {item.content}
          <br key={item.id} />
        </>
      ))}
    </div>
  );
}
