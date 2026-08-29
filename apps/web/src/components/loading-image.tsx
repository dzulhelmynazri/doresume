import Image from "next/image";

export const LoadingImage = () => (
  <Image
    alt="loading"
    height={100}
    loading="eager"
    priority
    src="/confused.gif"
    width={100}
  />
);
