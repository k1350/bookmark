import styles from "./index.module.css";

type Props = {
  data: {
    id: number;
    content: string;
  }[];
};
export function ParagraphNovel({ data }: Props) {
  return (
    <div className="Novel">
      {data.map((item) => (
        <p key={item.id} className={styles.NovelParagraph}>
          {item.content}
        </p>
      ))}
    </div>
  );
}
