import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <div className={styles.header}>
        <Image src="/sphere.svg" alt="Sphere" width={100} height={100} />
        <Image
          className={styles.wordmark}
          src="/onchainkit.svg"
          alt="OnchainKit"
          width={400}
          height={80}
        />
      </div>

      <p>
        Get started by editing <code>app/page.tsx</code>
      </p>
    </div>
  );
}
